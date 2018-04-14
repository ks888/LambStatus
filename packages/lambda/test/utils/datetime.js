import assert from 'assert'
import { formatDateTime, formatDateTimeInPST, changeTimezoneToUTC } from 'utils/datetime'

describe('datetime', () => {
  describe('formatDateTime', () => {
    it('should format datetime', async () => {
      assert(formatDateTime('2018-04-09T01:00:00Z') === 'Apr 9, 2018, 01:00 UTC')
      assert(formatDateTime('2018-04-09T01:00:00+09:00') === 'Apr 8, 2018, 16:00 UTC')
    })
  })

  describe('formatDateTimeInPST', () => {
    it('should format datetime in PST', async () => {
      assert(formatDateTimeInPST('2018-04-09T01:00:00Z') === 'Apr 8, 18:00 PST')
      assert(formatDateTimeInPST('2018-04-09T01:00:00+09:00') === 'Apr 8, 09:00 PST')
    })
  })

  describe('changeTimezoneToUTC', () => {
    it('should change time zone from local to UTC', async () => {
      assert(changeTimezoneToUTC('2018-04-09T01:00:00+09:00') === '2018-04-08T16:00:00Z')
      assert(changeTimezoneToUTC('2018-04-09T01:00:00+00:00') === '2018-04-09T01:00:00Z')
    })
  })
})
