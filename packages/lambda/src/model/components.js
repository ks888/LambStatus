import ComponentsDB from 'db/components'
import generateID from 'utils/generateID'
import { componentStatuses } from 'utils/const'
import { NotFoundError, ValidationError } from 'utils/errors'

export class Component {
  constructor (componentID, name, description, status, order) {
    if (!componentID) {
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
    if (!order) {
      this.order = Math.floor(new Date().getTime() / 1000)
    } else {
      this.order = order
    }
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
    const db = new ComponentsDB()
    await db.updateComponent(this.componentID, this.name, this.description, this.status, this.order)
  }

  async delete () {
    const db = new ComponentsDB()
    await db.deleteComponent(this.componentID)
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
    const db = new ComponentsDB()
    const components = await db.getComponents()
    return components.map(comp => {
      return new Component(comp.componentID, comp.name, comp.description, comp.status, comp.order)
    })
  }

  async lookup (componentID) {
    const db = new ComponentsDB()
    const comps = await db.getComponentsByID(componentID)
    if (comps.length === 0) {
      throw new NotFoundError('no matched item')
    } else if (comps.length === 1) {
      const comp = comps[0]
      return new Component(comp.componentID, comp.name, comp.description, comp.status, comp.order)
    } else {
      throw new Error('matched too many items')
    }
  }
}
