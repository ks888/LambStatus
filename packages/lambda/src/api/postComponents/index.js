import ComponentsStore from 'db/components'
import { Component } from 'model/components'

export async function handle (event, context, callback) {
  try {
    const comp = new Component(event)
    comp.validateExceptID()
    const store = new ComponentsStore()
    await store.create(comp)

    callback(null, comp.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to create a new component')
    }
  }
}
