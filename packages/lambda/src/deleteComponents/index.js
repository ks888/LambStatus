import { deleteComponent } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    await deleteComponent(event.params.componentid)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to delete a component')
  }
}
