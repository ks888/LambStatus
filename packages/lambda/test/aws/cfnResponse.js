import assert from 'assert'
import https from 'https'
import sinon from 'sinon'
import Response from 'aws/cfnResponse'

describe('cfnResponse', () => {
  let requestStub, body
  beforeEach(() => {
    requestStub = sinon.stub(https, 'request', (options, callback) => {
      return {
        on: () => {},
        write: (respBody) => { body = JSON.parse(respBody) },
        end: () => { callback({}) } }
    })
  })

  afterEach(() => {
    https.request.restore()
  })

  context('sendSuccess', () => {
    it('should send the successful status', async () => {
      await Response.sendSuccess({ResponseURL: 'example.com'}, {done: () => {}})
      assert(requestStub.calledOnce)
      assert(body.Status === 'SUCCESS')
    })

    it('should throw error if failed to send a request', async () => {
      https.request.restore() // already wrapped
      requestStub = sinon.stub(https, 'request', (options, callback) => {
        let errCallback
        return {
          on: (event, callback) => { if (event === 'error') { errCallback = callback } },
          write: () => {},
          end: () => { errCallback() }
        }
      })

      let err
      try {
        await Response.sendSuccess({ResponseURL: 'example.com'}, {done: () => {}})
      } catch (error) {
        err = error
      }
      assert(err !== undefined)
    })
  })

  context('sendFailed', () => {
    it('should send the failed status', async () => {
      await Response.sendFailed({ResponseURL: 'example.com'}, {done: () => {}})
      assert(requestStub.calledOnce)
      assert(body.Status === 'FAILED')
    })
  })
})
