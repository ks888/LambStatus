import assert from 'assert'
import { Component } from 'model/components'

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
      assert(comp.order !== undefined)
      assert(comp.description === '')
    })
  })

  describe('validate', () => {
    const genMock = () => new Component({componentID: '1', name: 'name', status: 'Operational'})

    it('should return no error when input is valid', async () => {
      const comp = genMock()
      let error
      try {
        comp.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when componentID is invalid', async () => {
      const comp = genMock()
      comp.componentID = undefined
      let error
      try {
        comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })

  describe('validateExceptID', () => {
    const genMock = () => new Component({name: 'name', status: 'Operational'})

    it('should return no error when input is valid', async () => {
      const comp = genMock()
      let error
      try {
        comp.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when name is invalid', async () => {
      const comp = genMock()
      comp.name = ''
      let error
      try {
        comp.validateExceptID()
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
        comp.validateExceptID()
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
        comp.validateExceptID()
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
        comp.validateExceptID()
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
        comp.validateExceptID()
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
        comp.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })
})
