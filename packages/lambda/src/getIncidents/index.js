import { getIncidents } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    let comps = await getIncidents()
    callback(null, JSON.stringify(comps))
  } catch (error) {
    console.log('getIncidents error', error)
    console.log(error.stack)
    callback('Error: failed to get incidents list')
  }
}
