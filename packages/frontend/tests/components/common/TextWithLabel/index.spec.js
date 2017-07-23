import React from 'react'
import TextWithLabel from 'components/common/TextWithLabel'
import { shallow } from 'enzyme'

describe('TextWithLabel', () => {
  const generateProps = () => {
    return {
      label: 'label',
      text: 'text'
    }
  }

  it('should render the text', () => {
    const props = generateProps()
    const textField = shallow(<TextWithLabel {...props} />)

    assert(textField.find('label').text() === props.label)
    assert(textField.find('div').at(1).text() === props.text)
  })
})
