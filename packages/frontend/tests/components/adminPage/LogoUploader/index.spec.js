import React from 'react'
import LogoUploader from 'components/adminPage/LogoUploader/LogoUploader'
import { shallow } from 'enzyme'

describe('LogoUploader', () => {
  const generateProps = (logoID) => {
    return {
      logoID,
      onAdd: sinon.spy(),
      onDelete: sinon.spy()
    }
  }

  it('should render the icon buttons', () => {
    const props = generateProps()
    const uploader = shallow(<LogoUploader {...props} />)

    assert(uploader.find('label').text() === 'Logo Image')
    assert(uploader.find('img').length === 0)
    assert(uploader.find('IconButton').length === 2)
  })
})
