import React from 'react'
import AutolinkedText from 'components/common/AutolinkedText'
import { mount } from 'enzyme'

describe('AutolinkedText', () => {
  it('should linkify the text', () => {
    const text = 'github.com'
    const props = { text }
    const autolinkedText = mount(<AutolinkedText {...props} />)
    assert(autolinkedText.find({href: 'http://' + text}).length === 1)
    assert(autolinkedText.find('a').text() === text)
  })
})
