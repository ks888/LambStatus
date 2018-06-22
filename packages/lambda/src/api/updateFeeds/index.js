import Feed from 'feed'
import EventsHandler from 'api/eventsHandler'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { SettingsProxy } from 'api/utils'
import S3 from 'aws/s3'
import CloudFormation from 'aws/cloudFormation'
import { stackName } from 'utils/const'
import { formatDateTime } from 'utils/datetime'

const maxItems = 25

export async function handle (event, context, callback) {
  try {
    const cloudFormation = new CloudFormation(stackName)
    const statusPageURL = await cloudFormation.getStatusPageCloudFrontURL()
    const serviceName = await new SettingsProxy().getServiceName()
    const feed = await buildFeed(serviceName, statusPageURL)

    const { AWS_REGION: region } = process.env
    const bucket = await cloudFormation.getStatusPageBucketName()
    const s3 = new S3()
    await s3.putObject(region, bucket, 'history.atom', feed.atom1())
    await s3.putObject(region, bucket, 'history.rss', feed.rss2())
    callback(null)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to update the feeds')
  }
}

export const buildFeed = async (serviceName, statusPageURL) => {
  const feed = new Feed({
    id: `tag:${statusPageURL},2017:/history`,
    link: statusPageURL,
    title: `[${serviceName} Status] Incident History`,
    author: {
      name: serviceName
    }
  })

  const incidents = await buildIncidentItems(statusPageURL)
  const maintenances = await buildMaintenanceItems(statusPageURL)
  const events = incidents.concat(maintenances)
  events.sort(latestDateToOldest)
  for (let i = 0; i < Math.min(events.length, maxItems); i++) {
    feed.addItem(events[i])
  }

  return feed
}

export const latestDateToOldest = (a, b) => {
  if (a.date < b.date) return 1
  else if (b.date < a.date) return -1
  return 0
}

export const buildIncidentItems = async statusPageURL => {
  let incidents = await new IncidentsStore().query()
  incidents.sort(latestCreatedAtToOldest)

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDate = yesterday.toISOString().replace(/T[0-9:.]+Z$/, '')
  incidents = incidents.map((incident) => {
    incident.createdAt = yesterdayDate + incident.createdAt.replace(/^[0-9-]+/, '')
    incident.updatedAt = yesterdayDate + incident.updatedAt.replace(/^[0-9-]+/, '')
    return incident
  })

  const items = []
  for (let i = 0; i < Math.min(incidents.length, maxItems); i++) {
    items.push(await buildItem(incidents[i], new IncidentUpdatesStore(), statusPageURL))
  }
  return items
}

export const buildMaintenanceItems = async statusPageURL => {
  let maintenances = await new MaintenancesStore().query()
  maintenances.sort(latestCreatedAtToOldest)

  // Show the maintenances as if will happen tomorrow.
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDate = tomorrow.toISOString().replace(/T[0-9:.]+Z$/, '')
  maintenances = maintenances.map((maintenance) => {
    maintenance.createdAt = tomorrowDate + maintenance.createdAt.replace(/^[0-9-]+/, '')
    maintenance.updatedAt = tomorrowDate + maintenance.updatedAt.replace(/^[0-9-]+/, '')
    maintenance.startAt = tomorrowDate + maintenance.startAt.replace(/^[0-9-]+/, '')
    maintenance.endAt = tomorrowDate + maintenance.endAt.replace(/^[0-9-]+/, '')
    return maintenance
  })

  const items = []
  for (let i = 0; i < Math.min(maintenances.length, maxItems); i++) {
    items.push(await buildItem(maintenances[i], new MaintenanceUpdatesStore(), statusPageURL))
  }
  return items
}

export const buildItem = async (event, eventUpdatesStore, statusPageURL) => {
  const id = `tag:${statusPageURL},2017:Incident/${event.getEventID()}`
  const link = `${statusPageURL.replace(/\/$/, '')}/incidents/${event.getEventID()}`
  const date = new Date(event.getCreatedAt())
  const title = event.getName()

  let eventUpdates = await eventUpdatesStore.query(event.getEventID())

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDate = yesterday.toISOString().replace(/T[0-9:.]+Z$/, '')
  // Show the event updates as if they have happened yesterday.
  eventUpdates = eventUpdates.map(eventUpdate => {
    eventUpdate.createdAt = yesterdayDate + eventUpdate.createdAt.replace(/^[0-9-]+/, '')
    eventUpdate.updatedAt = yesterdayDate + eventUpdate.updatedAt.replace(/^[0-9-]+/, '')
    return eventUpdate
  })

  eventUpdates.sort(latestCreatedAtToOldest)

  const content = eventUpdates.map(upd => {
    return `<p><small>${formatDateTime(upd.getCreatedAt())}</small><br><strong>${upd.getStatus()}</strong> - ${upd.getMessage()}</p>`
  }).join('')
  const published = new Date(eventUpdates.length > 0 ? eventUpdates[0].getCreatedAt() : undefined)

  return {id, link, date, title, content, published}
}

export const latestCreatedAtToOldest = (a, b) => {
  if (a.getCreatedAt() < b.getCreatedAt()) return 1
  else if (b.getCreatedAt() < a.getCreatedAt()) return -1
  return 0
}
