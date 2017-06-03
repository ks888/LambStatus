import { Maintenance } from 'model/maintenances'
import SNS from 'aws/sns'

export async function handle (event, context, callback) {
  try {
    const maintenance = new Maintenance(event.params.maintenanceid, event.body.name, event.body.maintenanceStatus,
                                        event.body.startAt, event.body.endAt, event.body.message,
                                        event.body.components)
    await maintenance.validate()
    await maintenance.save()

    await new SNS().notifyIncident(maintenance)

    const obj = maintenance.objectify()
    const comps = obj.components
    delete obj.components
    callback(null, {
      maintenance: obj,
      components: comps
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
