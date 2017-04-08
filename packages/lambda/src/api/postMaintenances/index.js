import { Maintenance } from 'model/maintenances'

export async function handle (event, context, callback) {
  try {
    const maintenance = new Maintenance(undefined, event.name, event.maintenanceStatus, event.startAt,
                                        event.endAt, event.message, event.components)
    await maintenance.validate()
    await maintenance.save()

    const obj = maintenance.objectify()
    const comps = obj.components
    delete obj.components
    callback(null, JSON.stringify({
      maintenance: obj,
      components: comps
    }))
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
