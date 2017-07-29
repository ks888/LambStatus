import React from 'react'
import { shallow } from 'enzyme'
import Message from 'components/adminPage/MonitoringServices/Self/Message'

describe('Message', () => {
  describe('render', () => {
    it('should return the message with the link to script', () => {
      const props = {
        settings: { apiKeys: [{ value: 'myapikey' }] },
        apiHostname: 'example.com',
        metricID: 'myid',
        fetchSettings: () => {}
      }
      const msg = shallow(<Message {...props} />)
      assert(msg.text().match(/Note/))
      assert(msg.find('a').prop('href').match(new RegExp(props.metricID)) !== null)
      assert(msg.find('a').prop('href').match(new RegExp(props.settings.apiKeys[0].value)) !== null)
      assert(msg.find('a').prop('href').match(new RegExp(props.apiHostname)) !== null)
    })

    it('should return the link without api key if it does not exist', () => {
      const props = {
        settings: { apiKeys: [] },
        apiHostname: 'example.com',
        metricID: 'myid',
        fetchSettings: () => {}
      }
      const msg = shallow(<Message {...props} />)
      assert(msg.find('a').prop('href').match(/apiKey/) === null)
    })
  })
})
