import React from 'react'
import DropdownList from 'components/common/DropdownList'
import { shallow } from 'enzyme'

describe('DropdownList', () => {
  const generateProps = () => {
    return {
      onChange: () => {},
      list: ['a', 'b', 'c'],
      initialValue: 'a',
      disabled: false
    }
  }

  it('should render the dropdown list', () => {
    const props = generateProps()
    const ddList = shallow(<DropdownList {...props} />)

    assert(ddList.find('option').length === props.list.length)
    assert(ddList.find('select').prop('value') === props.initialValue)
    assert(ddList.hasClass('is-disabled') === false)
  })

  it('Should render the disabled dropdown list if specified', () => {
    const props = generateProps()
    props.disabled = true
    const ddList = shallow(<DropdownList {...props} />)

    assert(ddList.hasClass('is-disabled'))
  })
})
