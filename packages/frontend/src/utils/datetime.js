import moment from 'moment-timezone'

export const currTimeZone = moment().tz(moment.tz.guess()).format('z')

export const getDateTime = (datetime) => {
  return moment.tz(datetime, moment.tz.guess())
}

export const getFormattedDateTime = (datetime, fmt = 'MMM DD, YYYY - HH:mm (z)') => {
  return getDateTime(datetime).format(fmt)
}
