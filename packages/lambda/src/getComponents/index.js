import ComponentService from 'service/component'

export async function handler (event, context, callback) {
  const service = new ComponentService()
  try {
    let comps = await service.getComponents()
    callback(null, JSON.stringify(comps))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get components list')
  }
}
