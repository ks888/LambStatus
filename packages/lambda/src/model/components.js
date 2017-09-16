import ComponentsStore from 'db/components'
import generateID from 'utils/generateID'
import { componentStatuses } from 'utils/const'
import { ValidationError } from 'utils/errors'

export class Component {
  constructor ({componentID, name, description = '', status, order = Math.floor(new Date().getTime() / 1000)}) {
    if (componentID === undefined) {
      this.componentID = generateID()
      this.needIDValidation = false
    } else {
      // If the user specifies the component ID, the ID must be already existed.
      this.componentID = componentID
      this.needIDValidation = true
    }
    this.name = name
    this.description = description
    this.status = status
    this.order = order
  }

  async validate () {
    if (this.componentID === undefined || this.componentID === '') {
      throw new ValidationError('invalid componentID parameter')
    }

    if (this.needIDValidation) {
      const comps = new Components()
      await comps.lookup(this.componentID)
    }

    if (this.name === undefined || this.name === '') {
      throw new ValidationError('invalid name parameter')
    }

    if (this.description === undefined) {
      throw new ValidationError('invalid description parameter')
    }

    if (componentStatuses.indexOf(this.status) < 0) {
      throw new ValidationError('invalid status parameter')
    }

    if (this.order === undefined || (typeof this.order !== 'number') || Math.floor(this.order) !== this.order) {
      throw new ValidationError('invalid order parameter')
    }
  }

  async save () {
    const store = new ComponentsStore()
    await store.update(this.objectify())
  }

  async delete () {
    const store = new ComponentsStore()
    await store.delete(this.componentID)
  }

  objectify () {
    return {
      componentID: this.componentID,
      name: this.name,
      description: this.description,
      status: this.status,
      order: this.order
    }
  }
}

export class Components {
  async all () {
    const store = new ComponentsStore()
    const components = await store.getAll()
    return components.map(comp => new Component(comp))
  }

  async lookup (componentID) {
    const store = new ComponentsStore()
    const comp = await store.getByID(componentID)
    return new Component(comp)
  }
}
