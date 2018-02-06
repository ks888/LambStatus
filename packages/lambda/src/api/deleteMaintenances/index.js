import SNS, {messageType} from 'aws/sns'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'

export async function handle (event, context, callback) {
  try {
    const store = new MaintenancesStore()
    const maintenance = await store.get(event.params.maintenanceid)
    await store.delete(maintenance.maintenanceID)

    const updateStore = new MaintenanceUpdatesStore()
    const maintenanceUpdates = await updateStore.query(maintenance.maintenanceID)
    await updateStore.delete(event.params.maintenanceid, maintenanceUpdates.map(upd => upd.maintenanceUpdateID))

    await new SNS().notifyIncident(maintenance.maintenanceID, messageType.maintenanceDeleted)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to delete the maintenance')
  }
}
