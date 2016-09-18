
import { updateComponent } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    let newComp = await updateComponent(event.params.componentid, event.body.name,
      event.body.description, event.body.status)
    callback(null, JSON.stringify(newComp.Attributes))
  } catch (error) {
    console.log('patchComponents error', error)
    console.log(error.stack)
    callback('Failed to create a new component')
  }
}
