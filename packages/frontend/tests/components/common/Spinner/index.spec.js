import React from 'react'
import Spinner from 'components/common/Spinner'
import { shallow } from 'enzyme'

describe('Spinner', () => {
  const generateProps = () => {
    return {
      enable: true
    }
  }

  it('should render the spinner', () => {
    const props = generateProps()
    const spinner = shallow(<Spinner {...props} />)

    assert(spinner.find('div').exists())
  })

  it('should not show the spinner if disalbled', () => {
    const props = generateProps()
    props.enable = false
    const spinner = shallow(<Spinner {...props} />)

    assert(spinner.find('div').exists() === false)
  })
})
