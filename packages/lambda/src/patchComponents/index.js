import ComponentService from 'service/component'

export async function handler (event, context, callback) {
  const service = new ComponentService()
  try {
    const comp = await service.updateComponent(event.params.componentid, event.body.name,
      event.body.description, event.body.status)
    callback(null, JSON.stringify(comp))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    if (error.name === 'ParameterError') {
      callback('Error: ' + error.message)
    } else {
      callback('Error: failed to update a component')
    }
  }
}
