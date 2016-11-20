import { expect } from 'chai'
import sinon from 'sinon'
import ComponentService from 'service/component'
import * as componentTable from 'db/component'

describe('ComponentService', () => {
  afterEach(() => {
    componentTable.getComponents.restore()
  })

  context('getComponents', () => {
    it('should return a list of components', () => {
      const components = { testKey: 'testValue' }
      sinon.stub(componentTable, 'getComponents').returns(components)
      const comp = new ComponentService()
      return comp.getComponents().then(result => {
        expect(result).to.be.equal(components)
      })
    })

    it('should return error on exception thrown', () => {
      sinon.stub(componentTable, 'getComponents').throws()
      const comp = new ComponentService()
      return comp.getComponents().catch(error => {
        expect(error).to.match(/Error/)
      })
    })
  })
})
