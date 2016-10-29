import ComponentService from 'service/component'

export async function handler (event, context, callback) {
  const service = new ComponentService()
  try {
    await service.deleteComponent(event.params.componentid)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ParameterError':
        callback('Error: ' + error.message)
        break
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to delete a component')
    }
  }
}
