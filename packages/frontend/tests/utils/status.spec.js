import { getXAxisFormat, getTooltipTitleFormat, getIncrementTimestampFunc,
         timeframeDay, timeframeWeek } from 'utils/status'

describe('utils/status', () => {
  describe('getXAxisFormat', () => {
    context('if timeframe is Day', () => {
      let formatFunc, currDate
      beforeEach(() => {
        formatFunc = getXAxisFormat(timeframeDay)
        currDate = new Date()
        currDate.setHours(0)
      })

      it('should return hours and 00 minutes if 0 <= minutes && minutes < 5.', () => {
        for (let i = 0; i < 5; i++) {
          currDate.setMinutes(i)
          assert(formatFunc(currDate) === '0:00')
        }
      })

      it('should return hours and 10 minutes if 5 <= minutes && minutes < 15.', () => {
        for (let i = 5; i < 15; i++) {
          currDate.setMinutes(i)
          assert(formatFunc(currDate) === '0:10')
        }
      })

      it('should return +1 hours and 00 minutes if 55 <= minutes && minutes < 60.', () => {
        for (let i = 55; i < 60; i++) {
          currDate.setMinutes(i)
          assert(formatFunc(currDate) === '1:00')
        }
      })
    })

    context('if timeframe is Week', () => {
      it('should return month and date.', () => {
        const formatFunc = getXAxisFormat(timeframeWeek)
        const currDate = new Date(2017, 0, 1)
        assert(formatFunc(currDate) === '1/1')
      })
    })
  })

  describe('getTooltipTitleFormat', () => {
    context('if timeframe is Day', () => {
      it('should return month, date, hours and minutes.', () => {
        const formatFunc = getTooltipTitleFormat(timeframeDay)
        const currDate = new Date(2017, 0, 1, 0, 0)
        assert(formatFunc(currDate) === '1/1 - 0:00')
      })
    })

    context('if timeframe is Week', () => {
      it('should return month, date, hours and 00 minutes.', () => {
        const formatFunc = getTooltipTitleFormat(timeframeWeek)
        const currDate = new Date(2017, 0, 1, 0, 1)
        assert(formatFunc(currDate) === '1/1 - 0:00')
      })
    })
  })

  describe('getIncrementTimestampFunc', () => {
    context('if timeframe is Day', () => {
      it('should increment 5 minutes.', () => {
        const incrementFunc = getIncrementTimestampFunc(timeframeDay)
        const currDate = new Date(2017, 0, 1, 0, 0)
        incrementFunc(currDate)

        assert(currDate.getMinutes() === 5)
      })
    })

    context('if timeframe is Week', () => {
      it('should increment 1 hour.', () => {
        const incrementFunc = getIncrementTimestampFunc(timeframeWeek)
        const currDate = new Date(2017, 0, 1, 0, 1)
        incrementFunc(currDate)

        assert(currDate.getHours() === 1)
      })
    })
  })
})
