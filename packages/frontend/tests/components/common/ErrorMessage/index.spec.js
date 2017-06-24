import React from 'react'
import ErrorMessage from 'components/common/ErrorMessage'
import { shallow } from 'enzyme'

describe('ErrorMessage', () => {
  const generateProps = () => {
    return {
      message: 'error'
    }
  }

  it('should render the error message', () => {
    const props = generateProps()
    const errMsg = shallow(<ErrorMessage {...props} />)

    assert(errMsg.text() === props.message)
  })
})
