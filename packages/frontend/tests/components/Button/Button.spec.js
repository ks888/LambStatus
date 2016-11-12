import React from 'react'
import Button from 'components/Button/Button'
import ButtonCss from 'components/Button/Button.scss'
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
      plain: false
    }
    _wrapper = shallow(<Button {..._props} />)
  })

  it('Should render as a <button>.', () => {
    expect(_wrapper.is('button')).to.be.true
  })

  it('Should render with the name of button.', () => {
    expect(_wrapper.text()).to.equal(buttonName)
  })

  it('Should render with the given css class.', () => {
    expect(_wrapper.hasClass(buttonClass)).to.be.true
  })

  it('Should render with the plain design.', () => {
    expect(_wrapper.hasClass(ButtonCss.plain)).to.not.be.true

    _props.plain = true
    _wrapper = shallow(<Button {..._props} />)
    expect(_wrapper.hasClass(ButtonCss.plain)).to.be.true
  })

  it('Should call onClick callback.', () => {
    _spies.onClick.should.have.not.been.called

    _wrapper.simulate('click')

    _spies.onClick.should.have.been.called
  })
})
