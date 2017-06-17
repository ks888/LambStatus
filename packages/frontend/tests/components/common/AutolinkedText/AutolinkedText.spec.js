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
    assert(_wrapper.find({href: 'http://' + text}).length === 1)
    assert(_wrapper.find('a').text() === text)
  })
})
