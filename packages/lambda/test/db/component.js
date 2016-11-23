import { expect } from 'chai'
import AWS from 'aws-sdk-mock'
import { getComponents, getComponent, updateComponent } from 'db/component'

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

describe('getComponent', () => {
  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient')
  })

  it('should return a component', () => {
    const componentID = 'testID'
    const name = 'testName'
    const status = 'testStatus'
    const description = 'testDesc'
    const order = 1
    AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      callback(null, {
        Items: [{componentID, name, status, description, order: String(order)}]
      })
    })
    return getComponent(componentID).then(result => {
      expect(result).to.be.deep.equal([{ componentID, name, status, description, order }])
    })
  })

  it('should set an empty value if description and order do not exist', () => {
    const componentID = 'testID'
    const name = 'testName'
    const status = 'testStatus'
    AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      callback(null, {
        Items: [{componentID, name, status}]
      })
    })
    return getComponent().then(result => {
      expect(result).to.be.deep.equal([{ componentID, name, status, description: '', order: 0 }])
    })
  })

  it('should return error on exception thrown', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      callback('Error')
    })

    return getComponent().catch(error => {
      expect(error).to.match(/Error/)
    })
  })

  it('should return NotFoundError on no items', async () => {
    AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      callback(null, {Items: []})
    })

    return getComponent().catch(error => {
      expect(error).to.match(/NotFoundError/)
    })
  })
})

describe('updateComponent', () => {
  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient')
  })

  it('should update a component', () => {
    const componentID = 'testID'
    const name = 'testName'
    const status = 'testStatus'
    const description = 'testDesc'
    const order = '1'
    AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
      expect(params.ExpressionAttributeValues).to.include.keys(':d')
      callback(null, {
        Attributes: {componentID, name, status, description, order}
      })
    })
    return updateComponent(componentID, name, description, status, order).then(result => {
      expect(result).to.be.deep.equal({Attributes: { componentID, name, status, description, order }})
    })
  })

  it('should update a component with empty description', () => {
    const componentID = 'testID'
    const name = 'testName'
    const status = 'testStatus'
    const description = ''
    const order = '1'
    AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
      expect(params.ExpressionAttributeValues).to.not.include.keys(':d')
      callback(null, {
        Attributes: {componentID, name, status, order}
      })
    })
    return updateComponent(componentID, name, description, status, order).then(result => {
      expect(result).to.be.deep.equal({Attributes: { componentID, name, status, description, order }})
    })
  })

  it('should return error on exception thrown', async () => {
    const componentID = 'testID'
    const name = 'testName'
    const status = 'testStatus'
    const description = ''
    const order = '1'
    AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
      callback('Error')
    })

    return updateComponent(componentID, name, description, status, order).catch(error => {
      expect(error).to.match(/Error/)
    })
  })
})
