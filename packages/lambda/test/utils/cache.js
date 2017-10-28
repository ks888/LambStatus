import assert from 'assert'
import { getCacheControl } from 'utils/cache'

describe('cache', () => {
  describe('getCacheControl', () => {
    it('should return CacheControl value', async () => {
      assert(getCacheControl('application/javascript') === 'max-age=31536000')
      assert(getCacheControl('text/html') === 'max-age=10')
      assert(getCacheControl() === 'max-age=0')
    })
  })
})
