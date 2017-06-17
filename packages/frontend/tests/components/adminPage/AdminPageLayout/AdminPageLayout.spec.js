import React from 'react'
import { shallow } from 'enzyme'
import AdminPageLayout from 'components/adminPage/AdminPageLayout'
import Header from 'components/adminPage/Header'
import Drawer from 'components/adminPage/Drawer'

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
    assert(component.find(Header).length === 1)
  })

  it('Should render with Drawer Component.', function () {
    assert(component.find(Drawer).length === 1)
  })

  it('Should render with children.', function () {
    assert(component.contains(child))
  })
})
