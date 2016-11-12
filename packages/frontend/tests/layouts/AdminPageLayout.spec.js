import React from 'react'
import { shallow } from 'enzyme'
import AdminPageLayout from 'layouts/AdminPageLayout/AdminPageLayout'
import Header from 'components/Header'
import Drawer from 'components/Drawer'

describe('(Layout) AdminPage', function () {
  let _component
  let _props
  let _child

  beforeEach(function () {
    _child = <h1 className='child'>Child</h1>
    _props = {
      children: _child
    }

    _component = shallow(<AdminPageLayout {..._props} />)
  })

  it('Should render with Header Component.', function () {
    expect(_component.find(Header)).to.have.length(1)
  })

  it('Should render with Drawer Component.', function () {
    expect(_component.find(Drawer)).to.have.length(1)
  })

  it('Should render with children.', function () {
    expect(_component.contains(_child)).to.be.true
  })
})
