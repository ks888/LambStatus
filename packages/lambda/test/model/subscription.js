import assert from 'assert'
import { Subscriber } from 'model/subscription'

describe('Subscriber', () => {
  describe('constructor', () => {
    it('should construct a new instance', () => {
      const email = 'test@example.com'
      const password = 'password'
      const subscriber = new Subscriber(email, password)
      assert(subscriber.email === email)
      assert(subscriber.password === password)
    })

    it('should fill in insufficient values', () => {
      const subscriber = new Subscriber('test@example.com')
      assert(subscriber.password !== undefined)
    })
  })

  describe('validate', () => {
    const newSubscriber = () => new Subscriber('test@example.com', 'password')

    it('should return no error when input is valid', async () => {
      const subscriber = newSubscriber()
      let error
      try {
        subscriber.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when email address is invalid', async () => {
      const subscriber = newSubscriber()
      subscriber.email = 'invalid'
      let error
      try {
        subscriber.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when password is invalid', async () => {
      const subscriber = newSubscriber()
      subscriber.password = undefined
      let error
      try {
        subscriber.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })
})
