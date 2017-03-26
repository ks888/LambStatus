import { Maintenance } from 'model/maintenances'

export async function handle (event, context, callback) {
  try {
    const maintenance = new Maintenance(event.params.maintenanceid, event.body.name, event.body.status,
                                        event.body.startAt, event.body.endAt, event.body.message,
                                        event.body.components)
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
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to update the maintenance')
    }
  }
}
