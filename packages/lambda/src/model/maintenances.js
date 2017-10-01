import { maintenanceStatuses } from 'utils/const'
import { isValidDate } from 'utils/datetime'
import { ValidationError } from 'utils/errors'

export class Maintenance {
  constructor ({maintenanceID, name, status, startAt, endAt, updatedAt = new Date().toISOString()}) {
    this.maintenanceID = maintenanceID
    this.name = name
    this.status = status
    this.startAt = startAt
    this.endAt = endAt
    this.updatedAt = updatedAt
  }

  validate () {
    if (this.maintenanceID === undefined || this.maintenanceID === '') {
      throw new ValidationError('invalid maintenanceID parameter')
    }
    this.validateExceptID()
  }

  validateExceptID () {
    if (this.name === undefined || this.name === '') {
      throw new ValidationError('invalid name parameter')
    }

    if (maintenanceStatuses.indexOf(this.status) < 0) {
      throw new ValidationError('invalid maintenance status parameter')
    }

    if (!isValidDate(this.startAt)) {
      throw new ValidationError('invalid startAt parameter')
    }

    if (!isValidDate(this.endAt)) {
      throw new ValidationError('invalid endAt parameter')
    }

    if (this.startAt > this.endAt) {
      throw new ValidationError('startAt is later than endAt')
    }

    if (!isValidDate(this.updatedAt)) {
      throw new ValidationError('invalid updatedAt parameter')
    }
  }

  setMaintenanceID (maintenanceID) {
    this.maintenanceID = maintenanceID
  }

  objectify () {
    const { maintenanceID, name, status, startAt, endAt, updatedAt } = this
    return { maintenanceID, name, status, startAt, endAt, updatedAt }
  }
}

export class MaintenanceUpdate {
  constructor ({maintenanceID, maintenanceUpdateID, maintenanceStatus, message = '',
                updatedAt = new Date().toISOString()}) {
    this.maintenanceID = maintenanceID
    this.maintenanceUpdateID = maintenanceUpdateID
    this.maintenanceStatus = maintenanceStatus
    this.message = message
    this.updatedAt = updatedAt
  }

  validate () {
    if (this.maintenanceUpdateID === undefined || this.maintenanceUpdateID === '') {
      throw new ValidationError('invalid maintenanceUpdateID parameter')
    }
    this.validateExceptUpdateID()
  }

  validateExceptUpdateID () {
    if (this.maintenanceID === undefined || this.maintenanceID === '') {
      throw new ValidationError('invalid maintenanceID parameter')
    }

    if (maintenanceStatuses.indexOf(this.maintenanceStatus) < 0) {
      throw new ValidationError('invalid maintenance status parameter')
    }

    if (this.message === undefined) {
      throw new ValidationError('invalid message parameter')
    }

    if (!isValidDate(this.updatedAt)) {
      throw new ValidationError('invalid updatedAt parameter')
    }
  }

  setMaintenanceUpdateID (maintenanceUpdateID) {
    this.maintenanceUpdateID = maintenanceUpdateID
  }

  objectify () {
    const { maintenanceID, maintenanceUpdateID, maintenanceStatus, message, updatedAt } = this
    return { maintenanceID, maintenanceUpdateID, maintenanceStatus, message, updatedAt }
  }
}
