import React from 'react'
import { Link } from 'react-router'
import { shallow } from 'enzyme'
import Drawer from 'components/adminPage/Drawer'

describe('(Component) Drawer', () => {
  let _wrapper

  beforeEach(() => {
    _wrapper = shallow(<Drawer />)
  })

  it('Should render a Link to Incidents route', () => {
    const incidentNode = _wrapper.find(Link).at(0)
    assert(incidentNode.key() === 'incidents')
    assert(incidentNode.childAt(0).text() === 'Incidents')
    assert(incidentNode.prop('to') === '/incidents')
  })

  it('Should render a Link to Components route', () => {
    const incidentNode = _wrapper.find(Link).at(1)
    assert(incidentNode.key() === 'components')
    assert(incidentNode.childAt(0).text() === 'Components')
    assert(incidentNode.prop('to') === '/components')
  })
})
