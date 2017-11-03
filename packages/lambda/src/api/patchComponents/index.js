import ComponentsStore from 'db/components'
import { Component } from 'model/components'

export async function handle (event, context, callback) {
  try {
    const store = new ComponentsStore()
    const comp = await store.get(event.params.componentid)

    const newComp = new Component({...comp.objectify(), ...event.body})
    newComp.validate()
    await store.update(newComp)

    callback(null, newComp.objectify())
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
