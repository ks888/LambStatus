const oneYearBySeconds = 31536000

export const getCacheControl = (contentType) => {
  const prefix = 'max-age='
  switch (contentType) {
    case 'application/javascript':
    case 'text/css':
      return prefix + oneYearBySeconds
    case 'text/html':
    case 'application/json':
    default:
      return prefix + 0
  }
}
