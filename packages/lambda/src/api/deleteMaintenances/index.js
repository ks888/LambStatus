import { Maintenances } from 'model/maintenances'

export async function handle (event, context, callback) {
  try {
    const maintenances = new Maintenances()
    const maintenance = await maintenances.lookup(event.params.maintenanceid)
    await maintenance.delete()
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
        callback('Error: failed to delete the maintenance')
    }
  }
}
