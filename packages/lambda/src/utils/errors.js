export class ParameterError extends Error {
  constructor (message) {
    super()
    this.name = 'ParameterError'
    this.message = message
  }
}

export class NotFoundError extends Error {
  constructor (message) {
    super()
    this.name = 'NotFoundError'
    this.message = message
  }
}
