import { ValidationError } from 'utils/errors'
import generateID from 'utils/generateID'

const defaultPasswordLength = 32
const tokenLength = 64

// from https://stackoverflow.com/questions/46155/how-can-you-validate-an-email-address-in-javascript
const validEmailAddress = (email) => {
  // eslint-disable-next-line no-useless-escape, max-len
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export class Subscriber {
  constructor ({email,
                username = generateID(),
                password = generateID(defaultPasswordLength),
                token = generateID(tokenLength)}) {
    this.username = username
    this.email = email
    this.password = password
    this.token = token
  }

  validate () {
    if (this.email === undefined || !validEmailAddress(this.email)) {
      throw new ValidationError('invalid email address')
    }

    if (this.username === undefined) {
      throw new ValidationError('invalid username')
    }

    if (this.password === undefined) {
      throw new ValidationError('invalid password')
    }

    if (this.token === undefined) {
      throw new ValidationError('invalid token')
    }
  }
}
