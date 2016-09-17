
import { putComponent } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    let newComp = await putComponent(event.name, event.description, event.status)
    callback(null, JSON.stringify(newComp.Attributes))
  } catch (error) {
    console.log('postComponents error', error)
    console.log(error.stack)
    callback('Failed to create a new component')
  }
}
