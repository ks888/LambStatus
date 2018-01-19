import React from 'react'
import { shallow } from 'enzyme'
import ErrorMessage from 'components/common/ErrorMessage'
import Spinner from 'components/common/Spinner'
import LogoUploader from 'components/adminPage/LogoUploader/LogoUploader'

describe('LogoUploader', () => {
  const generateProps = (logoID) => {
    return {
      logoID,
      uploadLogo: sinon.spy()
    }
  }

  it('should show the disabled delete button if no image', () => {
    const props = generateProps()
    const uploader = shallow(<LogoUploader {...props} />)

    assert(uploader.find('img').length === 0)
    const deleteIcon = uploader.find('IconButton').find({iconName: 'delete'})
    assert(deleteIcon.exists())
    assert(deleteIcon.prop('disabled'))
  })

  it('should show the error message if there is an error', () => {
    const props = generateProps()
    const uploader = shallow(<LogoUploader {...props} />)
    uploader.setState({message: 'test'})

    assert(uploader.find(ErrorMessage).exists())
  })

  it('should show the image if there is logoID', () => {
    const props = generateProps('test')
    const uploader = shallow(<LogoUploader {...props} />)

    assert(uploader.find('img').exists())
    const deleteIcon = uploader.find('IconButton').find({iconName: 'delete'})
    assert(deleteIcon.exists())
    assert(deleteIcon.prop('disabled') === undefined)
  })

  it('should show the spinner if fetching', () => {
    const props = generateProps('test')
    const uploader = shallow(<LogoUploader {...props} />)
    uploader.setState({isUploading: true})

    assert(uploader.find(Spinner).exists())
    const deleteIcon = uploader.find('IconButton').find({iconName: 'delete'})
    assert(deleteIcon.exists())
    assert(deleteIcon.prop('disabled'))
  })
})
