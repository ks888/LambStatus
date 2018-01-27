import React from 'react'
import { Link } from 'react-router'
import { shallow } from 'enzyme'
import Drawer from 'components/adminPage/Drawer'

describe('Drawer', () => {
  let _wrapper

  beforeEach(() => {
    _wrapper = shallow(<Drawer />)
  })

  it('Should render a Link to Components route', () => {
    const node = _wrapper.find(Link).at(0)
    assert(node.key() === 'components')
    assert(node.prop('to') === '/components')
  })
})
