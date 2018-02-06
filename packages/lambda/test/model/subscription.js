import assert from 'assert'
import { Subscriber } from 'model/subscription'

describe('Subscriber', () => {
  describe('constructor', () => {
    it('should construct a new instance', () => {
      const email = 'test@example.com'
      const username = 'name'
      const password = 'password'
      const token = 'token'
      const subscriber = new Subscriber({email, username, password, token})
      assert(subscriber.email === email)
      assert(subscriber.username === username)
      assert(subscriber.password === password)
      assert(subscriber.token === token)
    })

    it('should fill in insufficient values', () => {
      const subscriber = new Subscriber({email: 'test@example.com'})
      assert(subscriber.username !== undefined)
      assert(subscriber.password !== undefined)
      assert(subscriber.token !== undefined)
    })
  })

  describe('validate', () => {
    const newSubscriber = () => new Subscriber({email: 'test@example.com'})

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

    it('should return error when username is invalid', async () => {
      const subscriber = newSubscriber()
      subscriber.username = undefined
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

    it('should return error when token is invalid', async () => {
      const subscriber = newSubscriber()
      subscriber.token = undefined
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
