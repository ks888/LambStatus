import { updateComponent } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    let newComp = await updateComponent(null, event.name, event.description, event.status)
    callback(null, JSON.stringify(newComp.Attributes))
  } catch (error) {
    console.log('postComponents error', error)
    console.log(error.stack)
    callback('Error: failed to create a new component')
  }
}
