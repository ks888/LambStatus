import React from 'react'
import { Drawer } from 'components/Drawer/Drawer'
import classes from 'components/Drawer/Drawer.scss'
import { Link } from 'react-router'
import { shallow } from 'enzyme'

describe('(Component) Drawer', () => {
  let _wrapper

  beforeEach(() => {
    _wrapper = shallow(<Drawer />)
  })

  it('Should render a Link to Incidents route', () => {
    const incidentNode = _wrapper.find(Link).at(0)
    expect(incidentNode.key()).to.equal('incidents')
    expect(incidentNode.childAt(0).text()).to.equal('Incidents')
    expect(incidentNode.prop('to')).to.equal('/incidents')
  })

  it('Should render a Link to Components route', () => {
    const incidentNode = _wrapper.find(Link).at(1)
    expect(incidentNode.key()).to.equal('components')
    expect(incidentNode.childAt(0).text()).to.equal('Components')
    expect(incidentNode.prop('to')).to.equal('/components')
  })
})
