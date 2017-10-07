import ComponentsStore from 'db/components'
import { Component } from 'model/components'

export async function handle (event, context, callback) {
  try {
    const params = Object.assign({}, {componentID: event.params.componentid}, event.body)
    const comp = new Component(params)
    comp.validate()
    const store = new ComponentsStore()
    await store.update(comp)

    callback(null, comp.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to update the component')
    }
  }
}
