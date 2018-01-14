import React from 'react'
import { shallow, mount } from 'enzyme'
import Button from 'components/common/Button'
import Settings from 'components/adminPage/Settings/Settings'
import { apiKeyStatuses } from 'components/adminPage/ApiKeysSelector'

describe('Settings', () => {
  const generateProps = () => {
    return {
      settings: {
        serviceName: 'service',
        apiKeys: [{id: '1', value: '1'}, {id: '2', value: '2'}]
      },
      fetchSettings: sinon.spy(),
      updateSettings: sinon.spy(),
      postApiKey: sinon.spy(),
      deleteApiKey: sinon.spy()
    }
  }

  context('constructor', () => {
    it('should initialize the state', () => {
      const props = generateProps()
      const settings = shallow(<Settings {...props} />)
      assert(settings.state('serviceName') === props.settings.serviceName)
      assert.deepEqual(settings.state('apiKeys')[0].id, props.settings.apiKeys[0].id)
      assert.deepEqual(settings.state('apiKeys')[0].status, apiKeyStatuses.created)
    })
  })

  context('componentWillReceiveProps', () => {
    it('should set the state', () => {
      const props = generateProps()
      const settings = shallow(<Settings {...props} />)
      props.settings.apiKeys = [{id: '2', value: '2'}]
      settings.setProps(props)

      assert.deepEqual(settings.state('apiKeys')[0].id, '2')
    })
  })

  context('handleApiKeyAdd', () => {
    it('should add the new key', () => {
      const props = generateProps()
      const settings = shallow(<Settings {...props} />)
      settings.instance().handleApiKeyAdd()

      assert.deepEqual(settings.state('apiKeys').length, props.settings.apiKeys.length + 1)
      assert.deepEqual(settings.state('apiKeys')[props.settings.apiKeys.length].status, apiKeyStatuses.toBeCreated)
    })
  })

  context('handleApiKeyDelete', () => {
    it('should set the delete flag', () => {
      const props = generateProps()
      const settings = shallow(<Settings {...props} />)
      settings.instance().handleApiKeyDelete(props.settings.apiKeys[0].id)

      assert.deepEqual(settings.state('apiKeys').length, props.settings.apiKeys.length)
      assert.deepEqual(settings.state('apiKeys')[0].status, apiKeyStatuses.toBeDeleted)
    })

    it('should remove the key from the list if the key is not created yet', () => {
      const props = generateProps()
      const settings = shallow(<Settings {...props} />)
      settings.instance().handleApiKeyAdd()
      settings.instance().handleApiKeyDelete(settings.state('apiKeys')[settings.state('apiKeys').length - 1].id)

      assert.deepEqual(settings.state('apiKeys').length, props.settings.apiKeys.length)
    })
  })

  context('handleClickSaveButton', () => {
    it('should call the updateSettings function', () => {
      const props = generateProps()
      const settings = shallow(<Settings {...props} />)
      settings.find(Button).simulate('click')

      assert(props.updateSettings.calledOnce)
    })

    it('should call the postApiKey function', () => {
      const props = generateProps()
      const settings = shallow(<Settings {...props} />)
      settings.instance().handleApiKeyAdd()
      settings.find(Button).simulate('click')

      assert(props.postApiKey.calledOnce)
      assert(props.deleteApiKey.notCalled)
    })

    it('should call the deleteApiKey function', () => {
      const props = generateProps()
      const settings = shallow(<Settings {...props} />)
      settings.instance().handleApiKeyDelete(props.settings.apiKeys[0].id)
      settings.find(Button).simulate('click')

      assert(props.postApiKey.notCalled)
      assert(props.deleteApiKey.calledOnce)
    })
  })
})
