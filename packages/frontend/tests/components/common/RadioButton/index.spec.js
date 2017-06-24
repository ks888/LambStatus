import React from 'react'
import RadioButton from 'components/common/RadioButton'
import { mount } from 'enzyme'

describe('RadioButton', () => {
  const generateProps = () => {
    return {
      onChange: sinon.spy(),
      label: 'radio label',
      groupName: 'radio group',
      checked: false
    }
  }

  it('should render the radio button', () => {
    const props = generateProps()
    const radioButton = mount(<RadioButton {...props} />)

    assert(radioButton.find('label').prop('htmlFor') === props.label)
    assert(radioButton.find('input').prop('name') === props.groupName)
    assert(radioButton.find('input').getDOMNode().checked === false)
  })

  it('should click the radio button if specified by checked props', () => {
    const props = generateProps()
    props.checked = true
    const radioButton = mount(<RadioButton {...props} />)

    assert(radioButton.find('input').getDOMNode().checked === true)
  })
})
