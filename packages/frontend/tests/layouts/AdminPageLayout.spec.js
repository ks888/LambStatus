import React from 'react'
import { shallow } from 'enzyme'
import AdminPageLayout from 'layouts/AdminPageLayout/AdminPageLayout'
import Header from 'containers/Header'
import Drawer from 'components/Drawer'

describe('(Layout) AdminPage', function () {
  let component, props, child

  beforeEach(function () {
    child = <h1 className='child'>Child</h1>
    props = {
      children: child
    }

    component = shallow(<AdminPageLayout {...props} />)
  })

  it('Should render with Header Component.', function () {
    expect(component.find(Header)).to.have.length(1)
  })

  it('Should render with Drawer Component.', function () {
    expect(component.find(Drawer)).to.have.length(1)
  })

  it('Should render with children.', function () {
    expect(component.contains(child)).to.be.true
  })
})
