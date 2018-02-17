import assert from 'assert'
import { getDateTimeFormat, getDateTimeInPST } from 'utils/datetime'

describe('datetime', () => {
  describe('getDateTimeFormat', () => {
    it('should format datetime', async () => {
      assert(getDateTimeFormat(new Date(2017, 0, 1, 0, 0)) === 'Jan 1, 2017, 00:00 UTC')
    })
  })

  describe('getDateTimeInPST', () => {
    it('should format datetime in PST', async () => {
      assert(getDateTimeInPST(new Date(2017, 0, 1, 0, 0)) === 'Dec 31, 17:00 PST')
    })
  })
})
