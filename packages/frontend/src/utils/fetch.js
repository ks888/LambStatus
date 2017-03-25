import { CognitoUserPool } from 'amazon-cognito-identity-js'
import { userPoolId, clientId } from 'utils/settings'

export class HTTPError extends Error {
  constructor (message) {
    super()
    this.name = 'HTTPError'
    this.message = message
  }
}

export const sendRequest = async (url, params = {}, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  if (onLoad && typeof onLoad === 'function') onLoad()

  const resp = await fetch(url, params)
  let body
  if (resp.headers.get('Content-Type').includes('application/json')) {
    body = await resp.json()
  } else {
    body = await resp.text()
  }

  if (200 <= resp.status && resp.status < 300) {
    if (onSuccess && typeof onSuccess === 'function') onSuccess()
    return body
  }
  if (onFailure && typeof onFailure === 'function') onSuccess()
  throw new HTTPError(body.errorMessage)
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
