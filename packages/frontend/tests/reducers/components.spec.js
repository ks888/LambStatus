import { listComponents, addComponent, editComponent,
  removeComponent } from 'actions/components'
import componentsReducer from 'reducers/components'

describe('Reducers/components', () => {
  const comp = {
    componentID: '1',
    name: 'name',
    description: 'desc',
    status: 'status',
    order: 0
  }

  describe('listComponentsHandler', () => {
    it('should update the `components` state.', () => {
      const state = componentsReducer(undefined, listComponents([comp]))
      assert.deepEqual([comp], state.components)
    })
  })

  describe('addComponentHandler', () => {
    it('should add the new component to the store.', () => {
      const state = componentsReducer({components: [comp]},
                                      addComponent({...comp, componentID: '2'}))

      assert(state.components.length === 2)
      assert(state.components[0].componentID === '1')
      assert(state.components[1].componentID === '2')
    })
  })

  describe('editComponentHandler', () => {
    it('should update the existing component.', () => {
      const newName = 'newname'
      const state = componentsReducer({components: [comp]}, editComponent({...comp, name: newName}))

      assert(state.components.length === 1)
      assert(state.components[0].name === newName)
    })

    it('should sort the components using latest orders.', () => {
      const comps = [comp, {...comp, componentID: '2'}]
      const state = componentsReducer({components: comps}, editComponent({...comp, order: 1}))

      assert(state.components.length === 2)
      assert(state.components[0].componentID === '2')
    })
  })

  describe('removeComponentHandler', () => {
    it('should delete the component.', () => {
      const state = componentsReducer({components: [comp]}, removeComponent('1'))
      assert(state.components.length === 0)
    })
  })
})
