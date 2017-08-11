import React from 'react'
import DropdownList from 'components/common/DropdownList'
import LabeledDropdownList from 'components/common/LabeledDropdownList'
import Spinner from 'components/common/Spinner'
import { shallow } from 'enzyme'

describe('LabeledDropdownList', () => {
  const generateProps = () => {
    return {
      id: 'test',
      label: 'test',
      list: ['a', 'b', 'c'],
      initialValue: 'a',
      onChange: () => {}
    }
  }

  it('should render the dropdown list with label', () => {
    const props = generateProps()
    const ddList = shallow(<LabeledDropdownList {...props} />)

    assert(ddList.find('label').text() === props.label)
    assert(ddList.find('label').prop('htmlFor') === props.id)
    assert(ddList.find('div').find({id: props.id}).length === 1)
    assert(ddList.find(DropdownList).prop('initialValue') === props.initialValue)
  })

  it('should show the spinner if specified', () => {
    const props = generateProps()
    props.showSpinner = true
    const ddList = shallow(<LabeledDropdownList {...props} />)

    assert(ddList.find(Spinner).length === 1)
  })

  it('should show the info icon if specified', () => {
    const props = generateProps()
    props.infoIconID = 'test'
    const ddList = shallow(<LabeledDropdownList {...props} />)

    assert(ddList.find('i').prop('data-for') === props.infoIconID)
  })
})
