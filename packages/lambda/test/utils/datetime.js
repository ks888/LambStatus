import assert from 'assert'
import { formatDateTime, formatDateTimeInPST, changeTimezoneToUTC } from 'utils/datetime'

describe('datetime', () => {
  describe('formatDateTime', () => {
    it('should format datetime', async () => {
      assert(formatDateTime(new Date(2017, 0, 1, 0, 0)) === 'Jan 1, 2017, 00:00 UTC')
    })
  })

  describe('formatDateTimeInPST', () => {
    it('should format datetime in PST', async () => {
      assert(formatDateTimeInPST(new Date(2017, 0, 1, 0, 0)) === 'Dec 31, 17:00 PST')
    })
  })

  describe('changeTimezoneToUTC', () => {
    it('should change time zone from local to UTC', async () => {
      assert(changeTimezoneToUTC('2018-04-09T01:00:00+09:00') === '2018-04-08T16:00:00Z')
      assert(changeTimezoneToUTC('2018-04-09T01:00:00+00:00') === '2018-04-09T01:00:00Z')
    })
  })
})
