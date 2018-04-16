// Event is an interface which all types of events such as incident should implement.
export class Event {
  validate () {
    throw new Error('not implemented')
  }

  validateExceptID () {
    throw new Error('not implemented')
  }

  setID (id) {
    throw new Error('not implemented')
  }

  objectify () {
    throw new Error('not implemented')
  }
}
