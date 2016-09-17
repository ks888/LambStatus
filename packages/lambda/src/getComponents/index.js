
import { getComponents } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  console.log('getComponents called')
  try {
    let comps = await getComponents()
    callback(null, JSON.stringify(comps))
  } catch (error) {
    console.log('getComponents error', error)
    console.log(error.stack)
    callback(JSON.stringify({
      error: 'Exception occurred'
    }))
  }
}
