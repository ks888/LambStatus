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
  const receiveBody = async (resp) => {
    if (resp.headers.get('Content-Type').includes('application/json')) {
      return await resp.json()
    } else {
      return await resp.text()
    }
  }

  // eslint-disable-next-line yoda
  if (200 <= resp.status && resp.status < 300) {
    let body
    if (resp.status !== 204) {
      body = await receiveBody(resp)
    }
    if (onSuccess && typeof onSuccess === 'function') onSuccess()
    return body
  }

  const body = await receiveBody(resp)
  if (onFailure && typeof onFailure === 'function') onFailure(body.errorMessage)
  throw new HTTPError(body.errorMessage)
}

export const buildHeaders = () => {
  const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId
  }
  const userPool = new CognitoUserPool(poolData)
  const cognitoUser = userPool.getCurrentUser()
  return new Promise((resolve, reject) => {
    if (cognitoUser == null) {
      resolve({ Authorization: '', 'Content-Type': 'application/json' })
      return
    }

    // Do network request if the token is expired.
    cognitoUser.getSession((err, session) => {
      if (err) {
        return reject(new Error('failed to get session: ', err.message))
      }
      const token = session.getIdToken().getJwtToken()
      resolve({ Authorization: token, 'Content-Type': 'application/json' })
    })
  })
}
