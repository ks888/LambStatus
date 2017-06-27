import React from 'react'
import ApiKeysSelector, { apiKeyStatuses } from 'components/adminPage/ApiKeysSelector'
import { shallow } from 'enzyme'

describe('ApiKeysSelector', () => {
  const generateProps = () => {
    return {
      apiKeys: [
        {id: '1', value: 'a', status: apiKeyStatuses.created},
        {id: '2', value: 'b', status: apiKeyStatuses.created}
      ],
      onAdd: sinon.spy(),
      onDelete: sinon.spy()
    }
  }

  it('should render the list of api keys', () => {
    const props = generateProps()
    const selector = shallow(<ApiKeysSelector {...props} />)

    assert(selector.find('label').text() === 'API Keys')
    assert(selector.find('input').at(0).prop('value') === props.apiKeys[0].value)
    assert(selector.find('input').at(1).prop('value') === props.apiKeys[1].value)
    assert(selector.find('i').length - 1 === props.apiKeys.length)
  })

  it('should show the info message if the key is not created', () => {
    const props = generateProps()
    props.apiKeys = [{ id: '1', status: apiKeyStatuses.toBeCreated }]
    const selector = shallow(<ApiKeysSelector {...props} />)

    assert(selector.find('input').at(0).prop('value').match(/SAVE/))
  })

  it('should show the info message if the key will be deleted', () => {
    const props = generateProps()
    props.apiKeys = [{ id: '1', status: apiKeyStatuses.toBeDeleted }]
    const selector = shallow(<ApiKeysSelector {...props} />)

    assert(selector.find('input').at(0).prop('value').match(/SAVE/))
  })

  it('should call onDelete if the delete icon is clicked', () => {
    const props = generateProps()
    const selector = shallow(<ApiKeysSelector {...props} />)
    selector.find('i').at(0).simulate('click')

    assert(props.onDelete.calledOnce)
  })

  it('should call onAdd if the plus icon is clicked', () => {
    const props = generateProps()
    const selector = shallow(<ApiKeysSelector {...props} />)
    selector.find('i').at(props.apiKeys.length).simulate('click')

    assert(props.onAdd.calledOnce)
  })
})
