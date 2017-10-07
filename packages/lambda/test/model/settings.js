import assert from 'assert'
import { Settings } from 'model/settings'

describe('Settings', () => {
  describe('validate', () => {
    it('should return true if the URL is valid', async () => {
      const settings = new Settings()
      const urls = ['https://example.com', 'http://example.com', 'example.com', 'https://example.com/test']
      urls.forEach(url => {
        assert(settings.validate(url))
      })
    })

    it('should return false if the URL is invalid', async () => {
      const settings = new Settings()
      const urls = ['https://', '', 'https://example']
      urls.forEach(url => {
        assert(!settings.validate(url))
      })
    })
  })
})
