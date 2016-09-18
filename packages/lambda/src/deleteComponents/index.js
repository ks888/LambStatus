import { deleteComponent } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    await deleteComponent(event.params.componentid)
  } catch (error) {
    console.log('deleteComponents error', error)
    console.log(error.stack)
    callback('Failed to delete a component')
  }
}
