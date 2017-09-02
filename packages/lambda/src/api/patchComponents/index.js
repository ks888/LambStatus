import { Component } from 'model/components'

export async function handle (event, context, callback) {
  try {
    const params = Object.assign({}, {componentID: event.params.componentid}, event.body)
    const comp = new Component(params)
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
