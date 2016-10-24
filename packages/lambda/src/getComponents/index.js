import { getComponents } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    let comps = await getComponents()
    callback(null, JSON.stringify(comps))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get components list')
  }
}
