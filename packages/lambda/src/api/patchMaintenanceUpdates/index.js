import { MaintenanceUpdate } from 'model/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import SNS from 'aws/sns'

export async function handle (event, context, callback) {
  try {
    const maintenanceUpdate = new MaintenanceUpdate({
      maintenanceID: event.params.maintenanceid,
      maintenanceUpdateID: event.params.maintenanceupdateid,
      ...event.body
    })
    maintenanceUpdate.validate()

    const maintenanceUpdatesStore = new MaintenanceUpdatesStore()
    await maintenanceUpdatesStore.update(maintenanceUpdate)

    await new SNS().notifyIncident(maintenanceUpdate)

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
