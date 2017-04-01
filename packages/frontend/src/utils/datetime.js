import moment from 'moment-timezone'

export const getDateTimeFormat = (datetime, fmt = 'MMM DD, YYYY - HH:mm (z)') => {
  return moment.tz(datetime, moment.tz.guess()).format(fmt)
}
