import React from 'react'
import Button from 'components/common/Button'
import MiniEditor from 'components/common/MiniEditor'
import TextField from 'components/common/TextField'
import { mount } from 'enzyme'

describe('MiniEditor', () => {
  const generateProps = () => {
    return {
      onSave: sinon.spy(),
      onCancel: sinon.spy(),
      initialText: '',
      errorMessage: '',
      isUpdating: false
    }
  }

  it('should render the text field and buttons', () => {
    const props = generateProps()
    const editor = mount(<MiniEditor {...props} />)

    assert(editor.find(TextField).exists())
    assert(editor.find(TextField).prop('text') === props.initialText)
    assert(editor.find(Button).length === 2)
  })

  it('should call onSave if the save button is pressed', () => {
    const props = generateProps()
    const editor = mount(<MiniEditor {...props} />)
    editor.find(Button).at(1).simulate('click')

    assert(props.onSave.calledOnce)
  })
})
