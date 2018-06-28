// Event is an interface which all types of events such as incidents should implement.
export class Event {
  validate () {
    throw new Error('not implemented')
  }

  validateExceptEventID () {
    throw new Error('not implemented')
  }

  getEventID () {
    throw new Error('not implemented')
  }

  setEventID (id) {
    throw new Error('not implemented')
  }

  getURLPath () {
    throw new Error('not implemented')
  }

  getName () {
    throw new Error('not implemented')
  }

  getCreatedAt () {
    throw new Error('not implemented')
  }

  beforeUpdate () {
    throw new Error('not implemented')
  }

  objectify () {
    throw new Error('not implemented')
  }
}

// EventUpdate is an interface which all types of events such as incident updates should implement.
export class EventUpdate {
  validate () {
    throw new Error('not implemented')
  }

  validateExceptEventUpdateID () {
    throw new Error('not implemented')
  }

  getEventID () {
    throw new Error('not implemented')
  }

  setEventID (id) {
    throw new Error('not implemented')
  }

  getEventUpdateID () {
    throw new Error('not implemented')
  }

  setEventUpdateID (id) {
    throw new Error('not implemented')
  }

  getStatus () {
    throw new Error('not implemented')
  }

  getCreatedAt () {
    throw new Error('not implemented')
  }

  getMessage () {
    throw new Error('not implemented')
  }

  objectify () {
    throw new Error('not implemented')
  }
}
