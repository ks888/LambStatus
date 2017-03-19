import { Component } from 'model/components'

export async function handle (event, context, callback) {
  try {
    let comp = new Component(undefined, event.name, event.description, event.status)
    await comp.validate()
    await comp.save()
    callback(null, JSON.stringify(comp.objectify()))
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
