import moment from 'moment'

export const isValidDate = (dateString) => {
  try {
    getDateObject(dateString)
  } catch (e) {
    return false
  }
  return true
}

export const getDateObject = (dateString) => {
  const date = new Date(dateString)
  // Thanks to https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
  if (Object.prototype.toString.call(date) === '[object Date]' && isNaN(date.getTime())) {
    throw new Error(`invalid date string ${dateString}`)
  }
  return date
}

export const formatDateTime = (datetime, fmt = 'MMM D, YYYY, HH:mm UTC') => {
  return moment(datetime).format(fmt)
}

export const formatDateTimeInPST = (datetime, fmt = 'MMM D, HH:mm [PST]') => {
  return moment(datetime).subtract(7, 'hours').format(fmt)
}

export const changeTimezoneToUTC = datetime => {
  return moment(datetime).utc().format()
}
