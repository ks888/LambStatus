import { updateComponent } from '../utils/dynamoDB'
import { componentStatuses } from '../utils/const'
import { ValidationError } from '../utils/errors'

export async function handler (event, context, callback) {
  try {
    if (event.name === undefined || event.name === '') {
      throw new ValidationError('invalid name parameter')
    }

    if (event.description === undefined || event.description === '') {
      throw new ValidationError('invalid description parameter')
    }

    const validStatus = componentStatuses.reduce((prev, status) => {
      if (prev || event.status === status) {
        return true
      }
      return false
    }, false)
    if (!validStatus) {
      throw new ValidationError('invalid status parameter')
    }

    let newComp = await updateComponent(null, event.name, event.description, event.status)
    callback(null, JSON.stringify(newComp.Attributes))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    if (error.name === 'ValidationError') {
      callback('Error: ' + error.message)
    } else {
      callback('Error: failed to create a new component')
    }
  }
}
