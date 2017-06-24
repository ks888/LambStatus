import React from 'react'
import Button from 'components/common/Button'
import ButtonCss from 'components/common/Button/Button.scss'
import { shallow } from 'enzyme'

describe('Button', () => {
  const generateProps = () => {
    return {
      onClick: () => {},
      name: 'testname',
      class: 'testclass',
      plain: false,
      disabled: false
    }
  }

  it('should render the button.', () => {
    const props = generateProps()
    const button = shallow(<Button {...props} />)

    assert(button.text() === props.name)
    assert(button.hasClass(props.class))
    assert(button.find('button').prop('disabled') === false)
  })

  it('should render the plain button if specified', () => {
    const props = generateProps()
    props.plain = true
    const button = shallow(<Button {...props} />)

    assert(button.hasClass(ButtonCss.plain))
  })

  it('Should render the disabled button if specified', () => {
    const props = generateProps()
    props.disabled = true
    const button = shallow(<Button {...props} />)

    assert(button.find('button').prop('disabled'))
  })
})
