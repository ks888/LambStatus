import { ValidationError } from 'utils/errors'

export class Settings {
  constructor ({serviceName, adminPageURL, statusPageURL, cognitoPoolID} = {}) {
    this.serviceName = serviceName
    this.adminPageURL = adminPageURL
    this.statusPageURL = statusPageURL
    this.cognitoPoolID = cognitoPoolID
  }

  validate (url) {
    // eslint-disable-next-line no-useless-escape, max-len
    return url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) !== null
  }

  async setServiceName (serviceName) {
    this.serviceName = serviceName
  }

  async getServiceName () {
    return this.serviceName
  }

  async setAdminPageURL (adminPageURL) {
    if (!this.validate(adminPageURL)) {
      throw new ValidationError('invalid url')
    }
    this.adminPageURL = adminPageURL
  }

  async getAdminPageURL () {
    return this.adminPageURL
  }

  async setStatusPageURL (statusPageURL) {
    if (!this.validate(statusPageURL)) {
      throw new ValidationError('invalid url')
    }
    this.statusPageURL = statusPageURL
  }

  async getStatusPageURL () {
    return this.statusPageURL
  }

  async setCognitoPoolID (cognitoPoolID) {
    this.cognitoPoolID = cognitoPoolID
  }

  async getCognitoPoolID () {
    return this.cognitoPoolID
  }
}
