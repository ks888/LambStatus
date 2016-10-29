import { getComponents, updateComponent, deleteComponent } from 'db/component'
import generateID from 'utils/generateID'
import { componentStatuses } from 'utils/const'
import { ParameterError } from 'utils/errors'

export default class ComponentService {
  async getComponents () {
    return await getComponents()
  }

  async createComponent (name, description, status) {
    const componentID = generateID()
    return await this.updateComponent(componentID, name, description, status)
  }

  async updateComponent (componentID, name, description, status) {
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

    const comp = await updateComponent(componentID, name, description, status)
    return comp.Attributes
  }

  async deleteComponent (componentID) {
    if (componentID === undefined || componentID === '') {
      throw new ParameterError('invalid componentID parameter')
    }
    await deleteComponent(componentID)
  }
}
