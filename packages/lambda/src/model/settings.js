export class Settings {
  constructor ({serviceName, adminPageURL, statusPageURL, cognitoPoolID} = {}) {
    this.serviceName = serviceName
    this.adminPageURL = adminPageURL
    this.statusPageURL = statusPageURL
    this.cognitoPoolID = cognitoPoolID
  }

  async setServiceName (serviceName) {
    this.serviceName = serviceName
  }

  async getServiceName () {
    return this.serviceName
  }

  async setAdminPageURL (adminPageURL) {
    this.adminPageURL = adminPageURL
  }

  async getAdminPageURL () {
    return this.adminPageURL
  }

  async setStatusPageURL (statusPageURL) {
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

  async setLogoID (logoID) {
    this.logoID = logoID
  }

  async getLogoID () {
    return this.logoID
  }
}
