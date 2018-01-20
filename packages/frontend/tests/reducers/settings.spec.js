import { listSettings, editSettings, editLogo, removeLogo, addApiKey,
         removeApiKey } from 'actions/settings'
import settingsReducer from 'reducers/settings'

describe('Reducers/Settings', () => {
  const settings = {
    adminPageURL: 'admin',
    statusPageURL: 'status',
    serviceName: 'service',
    logoID: 'logo',
    apiKeys: [{id: '1', value: '1'}, {id: '2', value: '2'}]
  }

  context('listSettingsHandler', () => {
    it('should set the settings state.', () => {
      const state = settingsReducer(undefined, listSettings(settings))
      assert.deepEqual(settings, state.settings)
    })

    it('should sort the api keys.', () => {
      const settingsWithCreatedDate = {
        ...settings,
        apiKeys: [{...settings.apiKeys[0], createdDate: '2'}, {...settings.apiKeys[1], createdDate: '1'}]
      }
      const state = settingsReducer(undefined, listSettings(settingsWithCreatedDate))
      assert(settings.apiKeys.length === state.settings.apiKeys.length)
      assert(state.settings.apiKeys[0].id === '2')
    })
  })

  context('editSettingsHandler', () => {
    it('should update the settings state except api keys.', () => {
      const newSettings = {
        adminPageURL: 'newAdmin',
        statusPageURL: 'newStatus',
        serviceName: 'newService'
      }
      const state = settingsReducer({settings}, editSettings(newSettings))
      assert(state.settings.adminPageURL === newSettings.adminPageURL)
      assert(state.settings.statusPageURL === newSettings.statusPageURL)
      assert(state.settings.serviceName === newSettings.serviceName)
      assert.deepEqual(state.settings.apiKeys, settings.apiKeys)
    })
  })

  context('editLogoHandler', () => {
    it('should update the logo id keeping other props.', () => {
      const resp = {
        id: '1'
      }
      const state = settingsReducer({settings}, editLogo(resp))
      assert(state.settings.logoID === resp.id)
      assert(state.settings.serviceName === settings.serviceName)
      assert.deepEqual(state.settings.apiKeys, settings.apiKeys)
    })
  })

  context('removeLogoHandler', () => {
    it('should make the logo id empty.', () => {
      const state = settingsReducer({settings}, removeLogo(settings.logoID))
      assert(state.settings.logoID === '')
      assert(state.settings.serviceName === settings.serviceName)
    })
  })

  context('addApiKeyHandler', () => {
    it('should add the new api key.', () => {
      const newApiKey = {id: '3', value: '3'}
      const state = settingsReducer({settings}, addApiKey(newApiKey))
      assert.deepEqual(settings.apiKeys.concat(newApiKey), state.settings.apiKeys)
    })
  })

  context('removeSettingHandler', () => {
    it('should delete the existing api key.', () => {
      const id = settings.apiKeys[0].id
      const state = settingsReducer({settings}, removeApiKey(id))

      assert(state.settings.apiKeys.length === settings.apiKeys.length - 1)
    })
  })
})
