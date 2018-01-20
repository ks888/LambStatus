import React from 'react'
import Spinner from 'components/common/Spinner'
import { shallow } from 'enzyme'

describe('Spinner', () => {
  it('should render the spinner', () => {
    const spinner = shallow(<Spinner />)

    assert(spinner.find('div').exists())
  })
})
