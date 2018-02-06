import SNS, {messageType} from 'aws/sns'
import { Maintenance, MaintenanceUpdate } from 'model/maintenances'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { updateComponentStatus } from 'api/utils'

export async function handle (event, context, callback) {
  try {
    const maintenanceID = event.params.maintenanceid
    const params = {maintenanceID, ...event.body}
    const maintenance = new Maintenance(params)
    maintenance.validate()
    const maintenancesStore = new MaintenancesStore()
    await maintenancesStore.update(maintenance)

    let maintenanceUpdate = new MaintenanceUpdate({
      maintenanceID,
      maintenanceStatus: event.body.status,
      message: event.body.message
    })
    maintenanceUpdate.validateExceptUpdateID()
    const maintenanceUpdatesStore = new MaintenanceUpdatesStore()
    await maintenanceUpdatesStore.create(maintenanceUpdate)

    if (event.body.components !== undefined) {
      await Promise.all(event.body.components.map(async (component) => {
        await updateComponentStatus(component)
      }))
    }

    const maintenanceWithMaintenanceUpdate = Object.assign(maintenanceUpdate.objectify(), maintenance.objectify())
    await new SNS().notifyIncident(maintenanceID, messageType.maintenanceUpdated)

    callback(null, {
      maintenance: maintenanceWithMaintenanceUpdate,
      components: event.body.components
    })
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to update the maintenance')
    }
  }
}
