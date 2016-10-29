import { getComponents, getComponent, updateComponent, deleteComponent } from 'db/component'
import generateID from 'utils/generateID'
import { componentStatuses } from 'utils/const'
import { ParameterError } from 'utils/errors'

export default class ComponentService {
  async getComponents () {
    return await getComponents()
  }

  validate (componentID, name, description, status) {
    if (componentID === undefined || componentID === '') {
      throw new ParameterError('invalid componentID parameter')
    }

    if (name === undefined || name === '') {
      throw new ParameterError('invalid name parameter')
    }

    if (description === undefined || description === '') {
      throw new ParameterError('invalid description parameter')
    }

    if (componentStatuses.indexOf(status) < 0) {
      throw new ParameterError('invalid status parameter')
    }
  }

  async createComponent (name, description, status) {
    const componentID = generateID()
    this.validate(componentID, name, description, status)

    const comp = await updateComponent(componentID, name, description, status)
    return comp.Attributes
  }

  async updateComponent (componentID, name, description, status) {
    this.validate(componentID, name, description, status)
    await getComponent(componentID)  // existence check

    const comp = await updateComponent(componentID, name, description, status)
    return comp.Attributes
  }

  async deleteComponent (componentID) {
    if (componentID === undefined || componentID === '') {
      throw new ParameterError('invalid componentID parameter')
    }

    await getComponent(componentID)  // existence check
    await deleteComponent(componentID)
  }
}
