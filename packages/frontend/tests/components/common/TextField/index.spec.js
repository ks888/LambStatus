import React from 'react'
import ReactTooltip from 'react-tooltip'
import TextField, { enterKeyCode } from 'components/common/TextField'
import { mount } from 'enzyme'

describe('TextField', () => {
  const generateProps = () => {
    return {
      onChange: sinon.spy(),
      onEnterKey: sinon.spy(),
      label: 'label',
      text: 'text',
      rows: 1
    }
  }

  it('should render the text field', () => {
    const props = generateProps()
    const textField = mount(<TextField {...props} />)

    assert(textField.find('label').text() === props.label)
    assert(textField.find('input').exists())
    assert(textField.find('input').prop('value') === props.text)
  })

  it('should render the text field using the textarea element if rows are > 2', () => {
    const props = generateProps()
    props.rows = 2
    const textField = mount(<TextField {...props} />)

    assert(textField.find('textarea').exists())
    assert(textField.find('textarea').prop('value') === props.text)
  })

  it('should call onChange if there is some input', () => {
    const props = generateProps()
    const textField = mount(<TextField {...props} />)
    textField.find('input').simulate('change', {target: {value: 'input'}})

    assert(props.onChange.calledOnce)
  })

  it('should call onEnterKey if the enter key is pressed', () => {
    const props = generateProps()
    const textField = mount(<TextField {...props} />)
    textField.find('input').simulate('keydown', {keyCode: enterKeyCode, target: {value: ''}})

    assert(props.onEnterKey.calledOnce)
  })

  it('should not call onEnterKey if the other key is pressed', () => {
    const props = generateProps()
    const textField = mount(<TextField {...props} />)
    textField.find('input').simulate('keydown', {keyCode: 0, target: {value: ''}})

    assert(props.onEnterKey.notCalled)
  })

  it('should show the tooltip if there is information prop', () => {
    const props = generateProps()
    props.information = 'info'
    const textField = mount(<TextField {...props} />)
    assert(textField.find(ReactTooltip).exists())
  })
})
