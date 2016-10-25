import { updateComponent } from '../utils/dynamoDB'
import { componentStatuses } from '../utils/const'

export async function handler (event, context, callback) {
  if (event.name === undefined || event.name === '') {
    const msg = 'Error: invalid name parameter'
    console.log(msg)
    callback(msg)
    return
  }

  if (event.description === undefined || event.description === '') {
    const msg = 'Error: invalid description parameter'
    console.log(msg)
    callback(msg)
    return
  }

  const validStatus = componentStatuses.reduce((prev, status) => {
    if (prev || event.status === status) {
      return true
    }
    return false
  }, false)
  if (!validStatus) {
    const msg = 'Error: invalid status parameter'
    console.log(msg)
    callback(msg)
    return
  }

  try {
    let newComp = await updateComponent(null, event.name, event.description, event.status)
    callback(null, JSON.stringify(newComp.Attributes))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to create a new component')
  }
}
