import { expect } from 'chai'
import sinon from 'sinon'
import { handler } from 'getComponents'
import ComponentService from 'service/component'

describe('getComponents', () => {
  afterEach(() => {
    ComponentService.prototype.getComponents.restore()
  })

  it('should return a list of components', () => {
    const components = { testKey: 'testValue' }
    sinon.stub(ComponentService.prototype, 'getComponents').returns(components)
    return handler({}, null, (error, result) => {
      expect(error).to.be.null
      expect(result).to.be.equal(JSON.stringify(components))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(ComponentService.prototype, 'getComponents').throws()
    return handler({}, null, (error, result) => {
      expect(error).to.match(/Error/)
    })
  })
})
