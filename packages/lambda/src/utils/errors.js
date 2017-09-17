export class ValidationError extends Error {
  constructor (message) {
    super()
    this.name = 'ValidationError'
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

export class MutexLockedError extends Error {
  constructor (message) {
    super()
    this.name = 'MutexLockedError'
    this.message = message
  }
}
