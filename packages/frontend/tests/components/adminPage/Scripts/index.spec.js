import React from 'react'
import Scripts from 'components/adminPage/Scripts'
import { shallow } from 'enzyme'

describe('Scripts', () => {
  const generateProps = () => {
    return {
      params: {
        metricid: '123',
        lang: 'python'
      },
      location: {
        query: {
          apiKey: 'my api key',
          hostname: 'example.com'
        }
      }
    }
  }

  describe('render', () => {
    it('should set the given parameters to the script ', () => {
      const props = generateProps()
      const scripts = shallow(<Scripts {...props} />)

      assert(scripts.text().match(new RegExp(props.params.metricid)) !== null)
      assert(scripts.text().match(new RegExp(props.params.apiKey)) !== null)
      assert(scripts.text().match(new RegExp(props.params.hostname)) !== null)
    })

    it('should show the error if the languages is unsupported ', () => {
      const props = generateProps()
      props.params.lang = 'Unknown'
      const scripts = shallow(<Scripts {...props} />)

      assert(scripts.text().match(/Unsupported/) !== null)
    })
  })
})
