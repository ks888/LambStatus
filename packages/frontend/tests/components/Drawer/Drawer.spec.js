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

  it('Should render a Link to Maintenances route', () => {
    const maintenanceNode = _wrapper.find(Link).at(0)
    assert(maintenanceNode.key() === 'maintenances')
    assert(maintenanceNode.childAt(0).text() === 'Scheduled Maintenances')
    assert(maintenanceNode.prop('to') === '/maintenances')
  })

  it('Should render a Link to Components route', () => {
    const componentNode = _wrapper.find(Link).at(2)
    assert(componentNode.key() === 'components')
    assert(componentNode.childAt(0).text() === 'Components')
    assert(componentNode.prop('to') === '/components')
  })
})
