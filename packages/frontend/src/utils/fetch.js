export class HTTPError extends Error {
  constructor (message) {
    super()
    this.name = 'HTTPError'
    this.message = message
  }
}

export const checkStatus = (response) => {
  return new Promise((resolve, reject) => {
    if (response.status >= 200 && response.status < 300) {
      resolve(response)
    } else {
      response.json().then(json => {
        reject(new HTTPError(json.errorMessage))
      })
    }
  })
}
