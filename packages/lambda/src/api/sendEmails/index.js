import { SettingsProxy } from 'api/utils'
import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'
import { messageType } from 'aws/sns'
import SES from 'aws/ses'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { Subscriber } from 'model/subscription'
import { stackName } from 'utils/const'

export async function handle (rawEvent, context, callback) {
  try {
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
  const statusPageURL = settings.getStatusPageURL()

  const incident = await new IncidentsStore().get(id)
  const incidentUpdates = await new IncidentUpdatesStore().query(id)
  const latestUpdate = incidentUpdates.reduce((latest, curr) => {
    if (latest.createdAt < curr.createdAt) {
      return curr
    }
    return latest
  })

  const title = generateTitle(serviceName, latestUpdate.incidentStatus, incident.name)

  const cloudFormation = new CloudFormation(stackName)
  const poolID = await cloudFormation.getSubscribersPoolID()
  const users = await listUsers(poolID)
  // TODO: parallelize
  for (let user of users) {
    const body = await generateBody(statusPageURL, latestUpdate, user)
    const ses = new SES('us-west-2', 'no-reply@demo-status.lambstatus.org')
    try {
      await ses.sendEmailWithRetry(user.email, title, body)
    } catch (err) {
      console.log(`failed to send the email to ${user.email}`, err)
    }
  }
}

const handleMaintenance = async (type, id) => {
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

const generateTitle = (serviceName, status, description) => {
  return `${serviceName} status - ${status}: ${description}`
}

const generateBody = async (statusPageURL, latestUpdate, user) => {
  return `
${latestUpdate.message}

${latestUpdate.createdAt}
--
Visit ${statusPageURL} for more details.
Click ${statusPageURL}/api/subscribers/unsubscribe?username=${user.username}&token=${user.token} to unsubscribe.
`
}
