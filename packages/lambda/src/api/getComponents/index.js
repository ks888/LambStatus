import { Components } from 'model/components'

export async function handle (event, context, callback) {
  try {
    let comps = await new Components().all()
    comps = comps.sort((a, b) => a.order - b.order)
    callback(null, comps.map(comp => comp.objectify()))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get components list')
  }
}
