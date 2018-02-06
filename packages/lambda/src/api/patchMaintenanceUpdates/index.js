import { MaintenanceUpdate } from 'model/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import SNS, {messageType} from 'aws/sns'

export async function handle (event, context, callback) {
  try {
    const maintenanceID = event.params.maintenanceid
    const maintenanceUpdate = new MaintenanceUpdate({
      maintenanceID,
      maintenanceUpdateID: event.params.maintenanceupdateid,
      ...event.body
    })
    maintenanceUpdate.validate()

    const maintenanceUpdatesStore = new MaintenanceUpdatesStore()
    await maintenanceUpdatesStore.update(maintenanceUpdate)

    await new SNS().notifyIncident(maintenanceID, messageType.maintenancePatched)

    callback(null, maintenanceUpdate.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to update the maintenance update')
    }
  }
}
