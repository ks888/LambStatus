import MaintenanceUpdatesStore from 'db/maintenanceUpdates'

export async function handle (event, context, callback) {
  try {
    let maintenanceUpdates = await new MaintenanceUpdatesStore().query(event.params.maintenanceid)

    // Show the incidents as if the incident has happened yesterday.
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayDate = yesterday.toISOString().replace(/T[0-9:.]+Z$/, '')
    maintenanceUpdates = maintenanceUpdates.map(maintenanceUpdate => {
      maintenanceUpdate.createdAt = yesterdayDate + maintenanceUpdate.createdAt.replace(/^[0-9-]+/, '')
      maintenanceUpdate.updatedAt = yesterdayDate + maintenanceUpdate.updatedAt.replace(/^[0-9-]+/, '')
      return maintenanceUpdate
    })
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
