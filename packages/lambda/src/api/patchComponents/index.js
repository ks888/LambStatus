import { Component } from 'model/components'

export async function handle (event, context, callback) {
  try {
    const comp = new Component(event.params.componentid, event.body.name,
                               event.body.description, event.body.status, event.body.order)
    await comp.validate()
    await comp.save()
    callback(null, comp.objectify())
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
        callback('Error: failed to update the component')
    }
  }
}
