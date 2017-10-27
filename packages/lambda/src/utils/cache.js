const oneYearBySeconds = 31536000
const oneDayBySeconds = 86400
const tenSeconds = 10

export const getCacheControl = (contentType) => {
  const prefix = 'max-age='
  switch (contentType) {
    case 'application/javascript':
    case 'text/css':
      return prefix + oneYearBySeconds
    case 'image/x-icon':
      return prefix + oneDayBySeconds
    case 'text/html':
    case 'application/json':
    default:
      return prefix + tenSeconds
  }
}
