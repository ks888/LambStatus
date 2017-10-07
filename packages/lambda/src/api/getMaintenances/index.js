import MaintenancesStore from 'db/maintenances'

export async function handle (event, context, callback) {
  try {
    const maintenances = await new MaintenancesStore().query()
    callback(null, maintenances.map(maintenance => maintenance.objectify()))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get maintenances list')
  }
}
