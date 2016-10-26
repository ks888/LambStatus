import { updateComponent } from '../utils/dynamoDB'
import { componentStatuses } from '../utils/const'
import { ValidationError } from '../utils/errors'

export async function handler (event, context, callback) {
  try {
    if (event.body.name === undefined || event.body.name === '') {
      throw new ValidationError('invalid name parameter')
    }

    if (event.body.description === undefined || event.body.description === '') {
      throw new ValidationError('invalid description parameter')
    }

    if (componentStatuses.indexOf(event.body.status) < 0) {
      throw new ValidationError('invalid status parameter')
    }

    let newComp = await updateComponent(event.params.componentid, event.body.name,
      event.body.description, event.body.status)
    callback(null, JSON.stringify(newComp.Attributes))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    if (error.name === 'ValidationError') {
      callback('Error: ' + error.message)
    } else {
      callback('Error: failed to update a component')
    }
  }
}
