import React from 'react'
import Button from 'components/common/Button'
import ButtonCss from 'components/common/Button/Button.scss'
import { shallow } from 'enzyme'

describe('(Component) Button', () => {
  let _props, _spies, _wrapper
  const buttonName = 'testname'
  const buttonClass = 'testclass'

  beforeEach(() => {
    _spies = {}
    _props = {
      onClick: (_spies.onClick = sinon.spy()),
      name: buttonName,
      class: buttonClass,
      plain: false,
      disabled: false
    }
    _wrapper = shallow(<Button {..._props} />)
  })

  it('Should render with the name of button.', () => {
    assert(_wrapper.text() === buttonName)
  })

  it('Should render with the given css class.', () => {
    assert(_wrapper.hasClass(buttonClass))
  })

  it('Should render with the plain design.', () => {
    assert(!_wrapper.hasClass(ButtonCss.plain))

    _props.plain = true
    _wrapper = shallow(<Button {..._props} />)
    assert(_wrapper.hasClass(ButtonCss.plain))
  })

  it('Should call onClick callback.', () => {
    _spies.onClick.notCalled

    _wrapper.simulate('click')

    _spies.onClick.calledOnce
  })

  it('Should render with the disabled button.', () => {
    _wrapper = shallow(<Button {..._props} disabled />)
    assert(_wrapper.find('button').prop('disabled'))
  })
})
