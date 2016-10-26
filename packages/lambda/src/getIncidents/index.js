import { getIncidents } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    let incidents = await getIncidents()
    callback(null, JSON.stringify(incidents))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get incidents list')
  }
}
