import { listComponents, addComponent, editComponent, removeComponent } from 'actions/components'
import componentsReducer from 'reducers/components'

describe('(Reducer) components', () => {
  const comp1 = {
    componentID: 'compID1',
    name: 'name1',
    description: 'desc1',
    status: 'status1',
    order: 0
  }
  const comp2 = {
    componentID: 'compID2',
    name: 'name2',
    description: 'desc2',
    status: 'status2',
    order: 0
  }

  describe('listComponentsHandler', () => {
    it('Should update the `components` state.', () => {
      const state = componentsReducer(undefined, listComponents([comp1]))
      assert.deepEqual([comp1], state.components)
    })
  })

  describe('addComponentHandler', () => {
    it('Should update the `components` state.', () => {
      const state = componentsReducer({
        components: [comp1]
      }, addComponent(comp2))
      assert.deepEqual([comp1, comp2], state.components)
    })
  })

  describe('editComponentHandler', () => {
    it('Should update the `components` state.', () => {
      const newComp1 = Object.assign({}, comp1, {
        name: 'newname'
      })
      const state = componentsReducer({
        components: [comp1]
      }, editComponent(newComp1))
      assert.deepEqual([newComp1], state.components)
    })
  })

  describe('removeComponentHandler', () => {
    it('Should update the `components` state.', () => {
      const state = componentsReducer({
        components: [comp1]
      }, removeComponent(comp1.componentID))
      assert.deepEqual([], state.components)
    })
  })
})
