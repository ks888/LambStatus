import React from 'react'
import AutolinkedText from 'components/common/AutolinkedText'
import { mount } from 'enzyme'

describe('(Component) AutolinkedText', () => {
  let _props, _wrapper
  const text = 'github.com'

  beforeEach(() => {
    _props = {
      text: text
    }
    _wrapper = mount(<AutolinkedText {..._props} />)
  })

  it('Should render with linked text.', () => {
    expect(_wrapper.find({href: 'http://' + text})).to.have.length(1)
    expect(_wrapper.find('a').text()).to.equal(text)
  })
})
