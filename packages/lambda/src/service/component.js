import { getComponents, getComponent, updateComponent, deleteComponent } from 'db/component'
import generateID from 'utils/generateID'
import { componentStatuses } from 'utils/const'
import { ParameterError } from 'utils/errors'

export default class ComponentService {
  async getComponents () {
    const comps = await getComponents()
    return comps.sort((a, b) => a.order - b.order)
  }

  validate (componentID, name, description, status, order) {
    if (componentID === undefined || componentID === '') {
      throw new ParameterError('invalid componentID parameter')
    }

    if (name === undefined || name === '') {
      throw new ParameterError('invalid name parameter')
    }

    if (description === undefined) {
      throw new ParameterError('invalid description parameter')
    }

    if (componentStatuses.indexOf(status) < 0) {
      throw new ParameterError('invalid status parameter')
    }

    if (order === undefined || (typeof order !== 'number') || Math.floor(order) !== order) {
      throw new ParameterError('invalid order parameter')
    }
  }

  async createComponent (name, description, status) {
    const componentID = generateID()
    const order = Math.floor(new Date().getTime() / 1000)
    this.validate(componentID, name, description, status, order)

    const comp = await updateComponent(componentID, name, description, status, order)
    return comp.Attributes
  }

  async updateComponent (componentID, name, description, status) {
    const order = Math.floor(new Date().getTime() / 1000)
    this.validate(componentID, name, description, status, order)
    await getComponent(componentID)  // existence check

    const comp = await updateComponent(componentID, name, description, status, order)
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
