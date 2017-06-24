import React from 'react'
import { Link as ReactRouterLink } from 'react-router'
import Link from 'components/common/Link'
import { shallow } from 'enzyme'

describe('Link', () => {
  const generateProps = () => {
    return {
      link: 'https://github.com',
      text: 'github'
    }
  }

  it('should render the link', () => {
    const props = generateProps()
    const link = shallow(<Link {...props} />)

    assert(link.find(ReactRouterLink).prop('to') === props.link)
    assert(link.find(ReactRouterLink).contains(props.text))
  })
})
