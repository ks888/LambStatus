import { expect } from 'chai'
import sinon from 'sinon'
import ComponentService from 'service/component'
import * as componentTable from 'db/component'

describe('[ComponentService]', () => {
  describe('getComponents', () => {
    afterEach(() => {
      componentTable.getComponents.restore()
    })

    it('should return a list of components', () => {
      const components = [{order: 2}, {order: 3}, {order: 1}]
      sinon.stub(componentTable, 'getComponents').returns(components)
      const comp = new ComponentService()
      return comp.getComponents().then(result => {
        expect(result).to.be.deep.equal([{order: 1}, {order: 2}, {order: 3}])
      })
    })

    it('should return error when getComponents throws exception', () => {
      sinon.stub(componentTable, 'getComponents').throws()
      const comp = new ComponentService()
      return comp.getComponents().catch(error => {
        expect(error).to.match(/Error/)
      })
    })
  })

  describe('validate', () => {
    it('should return no error when input is valid', () => {
      const comp = new ComponentService()
      expect(() => comp.validate('id', 'name', 'desc', 'Operational', 0)).to.not.throw(/Error/)
    })

    it('should return error when componentID is invalid', () => {
      const comp = new ComponentService()
      expect(() => comp.validate('', 'name', 'desc', 'Operational', 0)).to.throw(/invalid componentID parameter/)
      expect(() => comp.validate(undefined, 'name', 'desc', 'Operational', 0)).to.throw(/invalid componentID parameter/)
    })

    it('should return error when name is invalid', () => {
      const comp = new ComponentService()
      expect(() => comp.validate('id', '', 'desc', 'Operational', 0)).to.throw(/invalid name parameter/)
      expect(() => comp.validate('id', undefined, 'desc', 'Operational', 0)).to.throw(/invalid name parameter/)
    })

    it('should return error when description is invalid', () => {
      const comp = new ComponentService()
      expect(() => comp.validate('id', 'name', undefined, 'Operational', 0)).to.throw(/invalid description parameter/)
    })

    it('should return error when status is invalid', () => {
      const comp = new ComponentService()
      expect(() => comp.validate('id', 'name', 'desc', undefined, 0)).to.throw(/invalid status parameter/)
      expect(() => comp.validate('id', 'name', 'desc', '', 0)).to.throw(/invalid status parameter/)
      expect(() => comp.validate('id', 'name', 'desc', 'invalid', 0)).to.throw(/invalid status parameter/)
    })

    it('should return error when order is invalid', () => {
      const comp = new ComponentService()
      expect(() => comp.validate('id', 'name', 'desc', 'Operational', undefined)).to.throw(/invalid order parameter/)
      expect(() => comp.validate('id', 'name', 'desc', 'Operational', '0')).to.throw(/invalid order parameter/)
      expect(() => comp.validate('id', 'name', 'desc', 'Operational', 1.1)).to.throw(/invalid order parameter/)
    })
  })

  describe('createComponent', () => {
    afterEach(() => {
      componentTable.updateComponent.restore()
    })

    it('should create new component', () => {
      sinon.stub(componentTable, 'updateComponent', (componentID, name, description, status, order) => {
        return {
          Attributes: {
            componentID, name, description, status, order
          }
        }
      })
      const comp = new ComponentService()
      return comp.createComponent('name', 'desc', 'Operational').then(result => {
        expect(result.componentID).to.be.a('string')
        expect(result.order).to.be.a('number')
      })
    })

    it('should return error when updateComponent throws exception', () => {
      sinon.stub(componentTable, 'updateComponent').throws()
      const comp = new ComponentService()
      return comp.createComponent('name', 'desc', 'Operational').catch(error => {
        expect(error).to.match(/Error/)
      })
    })
  })

  describe('updateComponent', () => {
    afterEach(() => {
      componentTable.updateComponent.restore()
      componentTable.getComponent.restore()
    })

    it('should update component', () => {
      sinon.stub(componentTable, 'updateComponent', (componentID, name, description, status, order) => {
        return {
          Attributes: {
            componentID, name, description, status, order
          }
        }
      })
      sinon.stub(componentTable, 'getComponent', (componentID) => {})
      const comp = new ComponentService()
      return comp.updateComponent('id', 'name', 'desc', 'Operational').then(result => {
        expect(result.order).to.be.a('number')
      })
    })

    it('should return error when id does not exist', () => {
      sinon.stub(componentTable, 'updateComponent').throws()
      sinon.stub(componentTable, 'getComponent').throws()
      const comp = new ComponentService()
      return comp.updateComponent('id', 'name', 'desc', 'Operational').catch(error => {
        expect(error).to.match(/Error/)
      })
    })

    it('should return error when updateComponent throws exception', () => {
      sinon.stub(componentTable, 'updateComponent').throws()
      sinon.stub(componentTable, 'getComponent', (componentID) => {})
      const comp = new ComponentService()
      return comp.updateComponent('id', 'name', 'desc', 'Operational').catch(error => {
        expect(error).to.match(/Error/)
      })
    })
  })
})
