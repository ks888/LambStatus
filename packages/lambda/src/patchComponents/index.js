
import { updateComponent } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  console.log(event.body)
  console.log(event.params)
  console.log('patchComponents called')
  return
  try {
    let newComp = await updateComponent(event.name, event.description, event.status)
    callback(null, JSON.stringify(newComp.Attributes))
  } catch (error) {
    console.log('patchComponents error', error)
    console.log(error.stack)
    callback('Failed to create a new component')
  }
}
