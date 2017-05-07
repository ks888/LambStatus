import moment from 'moment'

export const getDateTimeFormat = (datetime, fmt = 'MMM D, YYYY, HH:mm UTC') => {
  return moment(datetime).format(fmt)
}
