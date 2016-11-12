import React from 'react'
import Button from 'components/Button/Button'
import { shallow } from 'enzyme'

describe('(Component) Button', () => {
  let _props, _spies, _wrapper

  beforeEach(() => {
    _spies = {}
    _props = {
      onClick: (_spies.onClick = sinon.spy()),
      name: "testname",
      class: "testclass",
      plain: true
    }
    _wrapper = shallow(<Button {..._props} />)
  })

  it('Should render as a <div>.', () => {
    expect(_wrapper.is('div')).to.equal(true)
  })

  it('Should render with an <h2> that includes Sample Counter text.', () => {
    expect(_wrapper.find('h2').text()).to.match(/Counter:/)
  })

  it('Should render props.counter at the end of the sample counter <h2>.', () => {
    expect(_wrapper.find('h2').text()).to.match(/5$/)
    _wrapper.setProps({ counter: 8 })
    expect(_wrapper.find('h2').text()).to.match(/8$/)
  })

  it('Should render exactly two buttons.', () => {
    expect(_wrapper.find('button')).to.have.length(2)
  })

  describe('An increment button...', () => {
    let _button

    beforeEach(() => {
      _button = _wrapper.find('button').filterWhere(a => a.text() === 'Increment')
    })

    it('has bootstrap classes', () => {
      expect(_button.hasClass('btn btn-default')).to.be.true
    })

    it('Should dispatch a `increment` action when clicked', () => {
      _spies.dispatch.should.have.not.been.called

      _button.simulate('click')

      _spies.dispatch.should.have.been.called
      _spies.increment.should.have.been.called
    });
  })

  describe('A Double (Async) button...', () => {
    let _button

    beforeEach(() => {
      _button = _wrapper.find('button').filterWhere(a => a.text() === 'Double (Async)')
    })

    it('has bootstrap classes', () => {
      expect(_button.hasClass('btn btn-default')).to.be.true
    })

    it('Should dispatch a `doubleAsync` action when clicked', () => {
      _spies.dispatch.should.have.not.been.called

      _button.simulate('click')

      _spies.dispatch.should.have.been.called
      _spies.doubleAsync.should.have.been.called
    });
  })
})
