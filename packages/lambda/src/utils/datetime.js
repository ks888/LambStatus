import moment from 'moment'

export const getDateObject = (dateString) => {
  const date = new Date(dateString)
  // Thanks to https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
  if (Object.prototype.toString.call(date) === '[object Date]' && isNaN(date.getTime())) {
    throw new Error(`invalid date string ${dateString}`)
  }
  return date
}

export const getDateTimeFormat = (datetime, fmt = 'MMM D, YYYY, HH:mm UTC') => {
  return moment(datetime).format(fmt)
}
