import { CognitoUserPool } from 'amazon-cognito-identity-js'
import { userPoolId, clientId } from 'utils/settings'

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
      if (response.headers.get('Content-Type').includes('application/json')) {
        response.json().then(json => {
          reject(new HTTPError(json.errorMessage))
        })
      } else {
        response.text().then(body => {
          reject(new HTTPError(`Error: ${response.statusText}`))
        })
      }
    }
  })
}

export const handleError = (onHTTPError) => {
  return (error) => {
    console.error(error.message)
    console.error(error.stack)
    if (error.name === 'HTTPError') {
      if (onHTTPError && typeof onHTTPError === 'function') onHTTPError(error.message)
    }
  }
}

export const buildHeaders = () => {
  const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId
  }
  const userPool = new CognitoUserPool(poolData)
  const cognitoUser = userPool.getCurrentUser()
  let token = ''
  if (cognitoUser != null) {
    cognitoUser.getSession((error, session) => {
      if (error) {
        console.warn('failed to get session: ' + error.message)
        return
      }
      token = session.getIdToken().getJwtToken()
    })
  }

  return { Authorization: token, 'Content-Type': 'application/json' }
}
