import assert from 'assert'
import sinon from 'sinon'
import { Components, Component } from 'model/components'
import ComponentsStore from 'db/components'

describe('Components', () => {
  describe('all', () => {
    afterEach(() => {
      ComponentsStore.prototype.getAll.restore()
    })

    it('should return a list of components', async () => {
      const components = [{componentID: 1}, {componentID: 2}]
      sinon.stub(ComponentsStore.prototype, 'getAll').returns(components)

      const comps = await new Components().all()
      assert(comps.length === 2)
      assert(comps[0].componentID === 1)
      assert(comps[1].componentID === 2)
    })

    it('should return error when the store throws exception', async () => {
      sinon.stub(ComponentsStore.prototype, 'getAll').throws()
      let error
      try {
        await new Components().all()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('lookup', () => {
    afterEach(() => {
      ComponentsStore.prototype.getByID.restore()
    })

    it('should return one component', async () => {
      sinon.stub(ComponentsStore.prototype, 'getByID').returns([{componentID: 1}])

      const comp = await new Components().lookup(1)
      assert(comp.componentID === 1)
    })

    it('should return error when matched no component', async () => {
      sinon.stub(ComponentsStore.prototype, 'getByID').returns([])
      let error
      try {
        await new Components().lookup(1)
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })

    it('should return error when matched multiple components', async () => {
      sinon.stub(ComponentsStore.prototype, 'getByID').returns([{componentID: 1}, {componentID: 1}])
      let error
      try {
        await new Components().lookup(1)
      } catch (e) {
        error = e
      }
      assert(error.name === 'Error')
    })
  })
})

describe('Component', () => {
  describe('constructor', () => {
    it('should construct a new instance', () => {
      const comp = new Component({componentID: '1', name: 'name', description: 'desc', status: 'status', order: 1})
      assert(comp.componentID === '1')
      assert(comp.name === 'name')
      assert(comp.description === 'desc')
      assert(comp.status === 'status')
      assert(comp.order === 1)
    })

    it('should fill in insufficient values', () => {
      const comp = new Component({name: 'name', status: 'status'})
      assert(comp.componentID.length === 12)
      assert(comp.order !== undefined)
      assert(comp.description === '')
    })
  })

  describe('validate', () => {
    const genMock = () => new Component({name: 'name', status: 'Operational'})

    it('should return no error when input is valid', async () => {
      const comp = genMock()
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when componentID is invalid', async () => {
      const comp = genMock()
      comp.componentID = ''
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when componentID does not exist', async () => {
      sinon.stub(ComponentsStore.prototype, 'getByID').returns([])
      const comp = new Component({componentID: '1', name: 'name', description: 'desc', status: 'Operational', order: 1})
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
      ComponentsStore.prototype.getByID.restore()
    })

    it('should return error when name is invalid', async () => {
      const comp = genMock()
      comp.name = ''
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return no error when description is empty', async () => {
      const comp = genMock()
      comp.description = ''
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when description is invalid', async () => {
      const comp = genMock()
      comp.description = undefined
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when status is invalid', async () => {
      const comp = genMock()
      comp.status = 'st'
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when order is string', async () => {
      const comp = genMock()
      comp.order = 'order'
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when order is float', async () => {
      const comp = genMock()
      comp.order = 1.1
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })

  describe('save', () => {
    it('should call the update method of store', async () => {
      const updateStub = sinon.stub(ComponentsStore.prototype, 'update').returns()

      const comp = new Component({componentID: '1', name: 'name', description: 'desc', status: 'status', order: 1})
      await comp.save()

      assert(updateStub.calledOnce)
      assert(updateStub.firstCall.args[0].componentID === '1')
      assert(updateStub.firstCall.args[0].name === 'name')

      ComponentsStore.prototype.update.restore()
    })
  })

  describe('delete', () => {
    it('should call the delete method of store', async () => {
      const updateStub = sinon.stub(ComponentsStore.prototype, 'delete').returns()

      const comp = new Component({componentID: '1'})
      await comp.delete()

      assert(updateStub.calledOnce)
      assert(updateStub.firstCall.args[0] === '1')

      ComponentsStore.prototype.delete.restore()
    })
  })
})
