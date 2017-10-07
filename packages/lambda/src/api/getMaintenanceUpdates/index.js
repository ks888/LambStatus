import MaintenanceUpdatesStore from 'db/maintenanceUpdates'

export async function handle (event, context, callback) {
  try {
    const maintenanceUpdates = await new MaintenanceUpdatesStore().query(event.params.maintenanceid)
    callback(null, maintenanceUpdates.map(maintenanceUpdate => maintenanceUpdate.objectify()))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to get maintenance updates')
    }
  }
}
