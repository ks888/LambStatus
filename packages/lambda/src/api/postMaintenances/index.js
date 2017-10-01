import SNS from 'aws/sns'
import { Maintenance, MaintenanceUpdate } from 'model/maintenances'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { updateComponentStatus } from 'api/utils'

export async function handle (event, context, callback) {
  try {
    const maintenance = new Maintenance(event)
    maintenance.validateExceptID()
    const maintenancesStore = new MaintenancesStore()
    await maintenancesStore.create(maintenance)

    let maintenanceUpdate = new MaintenanceUpdate({
      maintenanceID: maintenance.maintenanceID,
      maintenanceStatus: event.status,
      ...event
    })
    maintenanceUpdate.validateExceptUpdateID()
    const maintenanceUpdatesStore = new MaintenanceUpdatesStore()
    await maintenanceUpdatesStore.create(maintenanceUpdate)

    if (event.components !== undefined) {
      await Promise.all(event.components.map(async (component) => {
        await updateComponentStatus(component)
      }))
    }

    const maintenanceWithMaintenanceUpdate = Object.assign(maintenanceUpdate.objectify(), maintenance.objectify())
    await new SNS().notifyIncident(maintenanceWithMaintenanceUpdate)

    callback(null, {
      maintenance: maintenanceWithMaintenanceUpdate,
      components: event.components
    })
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to create a new maintenance')
    }
  }
}
