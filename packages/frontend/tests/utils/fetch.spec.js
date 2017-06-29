import fetchMock from 'fetch-mock'
import { CognitoUserPool } from 'amazon-cognito-identity-js'
import { sendRequest, buildHeaders } from 'utils/fetch'

describe('utils/fetch', () => {
  describe('sendRequest', () => {
    afterEach(() => {
      fetchMock.restore()
    })

    it('should return body if the response is 2xx.', async () => {
      fetchMock.get(/.*/, { body: '{}', headers: {'Content-Type': 'application/json'} })

      const body = await sendRequest('')
      assert.deepEqual(body, {})
    })

    it('should return undefined if the response is 204.', async () => {
      fetchMock.get(/.*/, { status: 204 })

      const body = await sendRequest('')
      assert(body === undefined)
    })

    it('should throw HTTPError if the response is not 2xx.', async () => {
      fetchMock.get(/.*/, { status: 400, headers: {'Content-Type': 'application/json'}, body: {errorMessage: 'error'} })

      try {
        await sendRequest('')
        assert(false)
      } catch (err) {
        assert(err.name === 'HTTPError')
        assert(err.message === 'error')
      }
    })
  })

  describe('buildHeaders', () => {
    it('should set auth header.', async () => {
      const token = 'token'
      const session = { getIdToken: () => { return { getJwtToken: () => token } } }
      const user = {username: 'inami', getSession: (callback) => { callback(null, session) }}
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return user
      })

      const headers = await buildHeaders()
      assert(headers.Authorization === token)

      CognitoUserPool.prototype.getCurrentUser.restore()
    })

    it('should set empty auth header if a user does not exist.', async () => {
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return null
      })

      const headers = await buildHeaders()
      assert(headers.Authorization === '')

      CognitoUserPool.prototype.getCurrentUser.restore()
    })

    it('should throw error if failed to get session.', async () => {
      const user = {username: 'inami', getSession: (callback) => { callback(new Error('error')) }}
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return user
      })

      try {
        await buildHeaders()
        assert(false)
      } catch (err) {
        assert(err !== undefined)
      }

      CognitoUserPool.prototype.getCurrentUser.restore()
    })
  })
})
