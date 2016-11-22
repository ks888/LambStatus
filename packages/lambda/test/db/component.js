import { expect } from 'chai'
import AWS from 'aws-sdk-mock'
import { getComponents } from 'db/component'

describe('getComponents', () => {
  afterEach(() => {
    AWS.restore('DynamoDB')
  })

  it('should return a list of components', () => {
    const componentID = 'testID'
    const name = 'testName'
    const status = 'testStatus'
    const description = 'testDesc'
    const order = 1
    AWS.mock('DynamoDB', 'scan', (params, callback) => {
      callback(null, {
        Items: [
          {
            componentID: {
              S: componentID
            },
            name: {
              S: name
            },
            status: {
              S: status
            },
            description: {
              S: description
            },
            order: {
              N: String(order)
            }
          }
        ]
      })
    })
    return getComponents().then(result => {
      expect(result).to.be.deep.equal([{ componentID, name, status, description, order }])
    })
  })

  it('should set an empty value if description and order do not exist', () => {
    const componentID = 'testID'
    const name = 'testName'
    const status = 'testStatus'
    AWS.mock('DynamoDB', 'scan', (params, callback) => {
      callback(null, {
        Items: [
          {
            componentID: {
              S: componentID
            },
            name: {
              S: name
            },
            status: {
              S: status
            }
          }
        ]
      })
    })
    return getComponents().then(result => {
      expect(result).to.be.deep.equal([{ componentID, name, status, description: '', order: 0 }])
    })
  })

  it('should return error on exception thrown', async () => {
    AWS.mock('DynamoDB', 'scan', (params, callback) => {
      callback('Error')
    })

    return getComponents().catch(error => {
      expect(error).to.match(/Error/)
    })
  })
})
