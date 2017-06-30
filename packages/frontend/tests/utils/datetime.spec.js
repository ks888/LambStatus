import { getFormattedDateTime } from 'utils/datetime'

describe('utils/datetime', () => {
  describe('getFormattedDateTime', () => {
    it('should return a formatted date time.', () => {
      assert(getFormattedDateTime(new Date(2017, 5, 29, 0, 0)).match(/Jun 29, 2017 - 00:00/))
    })
  })
})
