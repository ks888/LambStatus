import { Components } from 'model/components'

export async function handle (event, context, callback) {
  try {
    const components = new Components()
    const component = await components.lookup(event.params.componentid)
    await component.delete()
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
        callback('Error: failed to delete the component')
    }
  }
}
