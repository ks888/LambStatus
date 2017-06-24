import assert from 'assert'
import AWS from 'aws-sdk-mock'
import APIGateway from 'aws/apiGateway'

describe('APIGateway', () => {
  afterEach(() => {
    AWS.restore('APIGateway')
  })

  context('deploy', () => {
    it('should deploy the resources', async () => {
      AWS.mock('APIGateway', 'createDeployment', (params, callback) => {
        callback(null)
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.deploy('id', 'name')
      } catch (error) {
        err = error
      }

      assert(err === undefined)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'createDeployment', (params, callback) => {
        callback(new Error(''))
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.deploy('id', 'name')
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })

  context('getApiKeys', () => {
    it('should returns the list of api keys', async () => {
      const expect = ['token']
      AWS.mock('APIGateway', 'getApiKeys', (params, callback) => {
        callback(null, {items: expect})
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err, actual
      try {
        actual = await apiGateway.getApiKeys('name')
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert.deepEqual(actual, expect)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'getApiKeys', (params, callback) => {
        callback(new Error(''))
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.getApiKeys()
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })
})
