import React from 'react'
import IconButton from 'components/common/IconButton'
import { shallow } from 'enzyme'

describe('IconButton', () => {
  const generateProps = () => {
    return {
      onClick: sinon.spy(),
      iconName: 'file_upload',
      name: 'Upload'
    }
  }

  it('should render the button.', () => {
    const props = generateProps()
    const button = shallow(<IconButton {...props} />)

    assert(button.text().includes(props.name))
    assert(button.find('i').length === 1)
  })
})
