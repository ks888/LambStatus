import React from 'react'
import { Components } from 'routes/Components/components/Components'
import { shallow } from 'enzyme'

describe('(Component) Components', () => {
  let _props, _spies
  let _component

  beforeEach(() => {
    _spies = {}
    _props = {
      serviceComponents: [],
      loadStatus: 0,
      updateStatus: 0,
      message: '',
      fetchComponents: () => {},
      postComponent: () => {},
      updateComponent: () => {},
      deleteComponent: () => {}
    }
    _component = shallow(<Components {..._props} />)
  })

  it('Renders a headline', () => {
    expect(_component.find('h4').text()).to.equal('Components')
  })
})
