import showdown from 'showdown'
import { SettingsProxy } from 'api/utils'
import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'
import { messageType } from 'aws/sns'
import SES from 'aws/ses'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { Subscriber } from 'model/subscription'
import { stackName } from 'utils/const'
import { getDateTimeInPST } from 'utils/datetime'

export async function handle (rawEvent, context, callback) {
  try {
    const settings = new SettingsProxy()
    const emailNotification = await settings.getEmailNotification()
    if (!emailNotification.enable) return

    const event = JSON.parse(rawEvent.Records[0].Sns.Message)
    if (event.type === messageType.incidentCreated || event.type === messageType.incidentUpdated) {
      await handleIncident(event.type, event.message)
    } else if (event.type === messageType.maintenanceCreated || event.type === messageType.maintenanceUpdated) {
      await handleMaintenance(event.type, event.message)
    }

    callback(null)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to send the emails')
  }
}

const handleIncident = async (type, id) => {
  const settings = new SettingsProxy()
  const serviceName = await settings.getServiceName()
  const cloudFormation = new CloudFormation(stackName)
  const statusPageURL = await cloudFormation.getStatusPageCloudFrontURL()

  const incident = await new IncidentsStore().get(id)
  const incidentUpdates = await new IncidentUpdatesStore().query(id)
  incidentUpdates.sort((a, b) => {
    if (a.createdAt > b.createdAt) {
      return -1
    } else if (a.createdAt < b.createdAt) {
      return 1
    } else {
      return 0
    }
  })

  const email = new IncidentEmailContent({serviceName, statusPageURL, incident, incidentUpdates})
  await sendEmails(email)
}

const handleMaintenance = async (type, id) => {
  const settings = new SettingsProxy()
  const serviceName = await settings.getServiceName()
  const cloudFormation = new CloudFormation(stackName)
  const statusPageURL = await cloudFormation.getStatusPageCloudFrontURL()

  const maintenance = await new MaintenancesStore().get(id)
  const maintenanceUpdates = await new MaintenanceUpdatesStore().query(id)
  maintenanceUpdates.sort((a, b) => {
    if (a.createdAt > b.createdAt) {
      return -1
    } else if (a.createdAt < b.createdAt) {
      return 1
    } else {
      return 0
    }
  })

  const email = new MaintenanceEmailContent({serviceName, statusPageURL, maintenance, maintenanceUpdates})
  await sendEmails(email)
}

const sendEmails = async (email) => {
  const title = email.getTitle()

  const settings = new SettingsProxy()
  const emailNotification = await settings.getEmailNotification()
  const cloudFormation = new CloudFormation(stackName)
  const poolID = await cloudFormation.getSubscribersPoolID()
  const users = await listUsers(poolID)
  const parallelism = 16

  const sendEmailToUser = async user => {
    const body = email.getBody(user)

    const ses = new SES(emailNotification.sourceRegion, emailNotification.sourceEmailAddress)
    try {
      await ses.sendEmailWithRetry(user.email, title, body)
    } catch (err) {
      console.log(`failed to send the email to ${user.email}`, err)
    }
  }

  for (let i = 0; i < users.length; i += parallelism) {
    const begin = i
    const end = Math.min(i + parallelism, users.length)
    const currUsers = users.slice(begin, end)
    await Promise.all(currUsers.map(sendEmailToUser))
  }
}

const listUsers = async (poolID) => {
  const users = await new Cognito().listUsers(poolID)
  return users.map(user => {
    const email = user.Attributes.reduce((acc, curr) => (curr.Name === 'email' ? curr.Value : acc), undefined)
    const username = user.Username
    const token = user.Attributes.reduce((acc, curr) => (curr.Name === 'custom:token' ? curr.Value : acc), undefined)
    return new Subscriber({email, username, token})
  })
}

export class EmailContent {
  constructor ({serviceName, statusPageURL, event, eventUpdates}) {
    this.serviceName = serviceName
    this.statusPageURL = statusPageURL
    this.event = event
    this.eventUpdates = eventUpdates
  }

  getTitle () {
    if (this.eventUpdates === 0) {
      throw new Error('no updates')
    }

    const latestUpdate = this.eventUpdates[0]
    return `[${this.serviceName} status] ${latestUpdate.status}: ${this.event.name}`
  }

  getBody (user) {
    if (this.headerAndContent === undefined) {
      this.headerAndContent = this.generateHeader() + this.generateContent()
    }

    const body = this.headerAndContent + this.generateFooter(user)
    const converter = new showdown.Converter({headerLevelStart: 2})
    return converter.makeHtml(body)
  }

  generateHeader () {
    if (this.eventUpdates.length === 0) {
      throw new Error('no updates')
    } else if (this.eventUpdates.length === 1) {
      return this.generateHeaderForNewEvent()
    } else {
      return this.generateHeaderForUpdatedEvent()
    }
  }

  generateHeaderForNewEvent () {
    throw new Error('not implemented')
  }

  generateHeaderForUpdatedEvent () {
    throw new Error('not implemented')
  }

  generateContent () {
    if (this.eventUpdates.length === 0) {
      throw new Error('no updates')
    } else if (this.eventUpdates.length === 1) {
      return this.generateContentForNewEvent()
    } else {
      return this.generateContentForUpdatedEvent()
    }
  }

  generateContentForNewEvent () {
    throw new Error('not implemented')
  }

  generateContentForUpdatedEvent () {
    throw new Error('not implemented')
  }

  generateFooter (user) {
    return `
---------------

View [status page](${this.statusPageURL}) or [unsubscribe here](${this.statusPageURL}/api/subscribers/unsubscribe?username=${user.username}&token=${user.token}).
`
  }
}

export class IncidentEmailContent extends EmailContent {
  constructor ({serviceName, statusPageURL, incident, incidentUpdates}) {
    const event = incident
    const eventUpdates = incidentUpdates.map(upd => {
      return {
        ...upd,
        status: upd.incidentStatus
      }
    })
    super({serviceName, statusPageURL, event, eventUpdates})

    this.incident = incident
    this.incidentUpdates = incidentUpdates
  }

  generateHeaderForNewEvent () {
    return `
# ${this.incident.name}

*Incident Report for ${this.serviceName} Statuspage*
`
  }

  generateHeaderForUpdatedEvent () {
    return this.generateHeaderForNewEvent()
  }

  generateContentForNewEvent () {
    const latestUpdate = this.eventUpdates[0]
    return `
## ${latestUpdate.status} - ${getDateTimeInPST(latestUpdate.createdAt)}

${latestUpdate.message}
`
  }

  generateContentForUpdatedEvent () {
    const latestUpdate = this.eventUpdates[0]
    let text = `
## New Incident Status: ${latestUpdate.status} - ${getDateTimeInPST(latestUpdate.createdAt)}

${latestUpdate.message}

## Previous Updates
`

    for (let i = 1; i < this.eventUpdates.length; i++) {
      const update = this.eventUpdates[i]
      text += `
### ${update.status} - ${getDateTimeInPST(update.createdAt)}

${update.message}
`
    }
    return text
  }

}

export class MaintenanceEmailContent extends EmailContent {
  constructor ({serviceName, statusPageURL, maintenance, maintenanceUpdates}) {
    const event = maintenance
    const eventUpdates = maintenanceUpdates.map(upd => {
      return {
        ...upd,
        status: upd.maintenanceStatus
      }
    })
    super({serviceName, statusPageURL, event, eventUpdates})

    this.maintenance = maintenance
    this.maintenanceUpdates = maintenanceUpdates
  }

  generateHeaderForNewEvent () {
    return `
# ${this.maintenance.name}

*${getDateTimeInPST(this.maintenance.startAt)} - ${getDateTimeInPST(this.maintenance.endAt)}*
`
  }

  generateHeaderForUpdatedEvent () {
    return `
# ${this.maintenance.name}

*Scheduled Maintenance for ${this.serviceName} Statuspage*
`
  }

  generateContentForNewEvent () {
    const latestUpdate = this.eventUpdates[0]
    return `
## Maintenance Details - ${getDateTimeInPST(latestUpdate.createdAt)}

${latestUpdate.message}
`
  }

  generateContentForUpdatedEvent () {
    const latestUpdate = this.eventUpdates[0]
    let text = `
## New Maintenance Status: ${latestUpdate.status} - ${getDateTimeInPST(latestUpdate.createdAt)}

${latestUpdate.message}

## Previous Updates
`

    for (let i = 1; i < this.eventUpdates.length; i++) {
      const update = this.eventUpdates[i]
      text += `
### ${update.status} - ${getDateTimeInPST(update.createdAt)}

${update.message}
`
    }
    return text
  }
}
