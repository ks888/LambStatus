import 'whatwg-fetch'
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { userPoolId, clientId } from 'utils/settings'

export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS'

export function signinSuccess (token) {
  return {
    type: SIGNIN_SUCCESS,
    token
  }
}

export const signin = (username, password, callbacks = {}) => {
  const { onLoad, onNewPasswordRequested, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    const authenticationData = {
      Username: username,
      Password: password
    }
    const authenticationDetails = new AuthenticationDetails(authenticationData)

    const poolData = {
      UserPoolId: userPoolId,
      ClientId: clientId
    }
    const userPool = new CognitoUserPool(poolData)
    const userData = {
      Username: username,
      Pool: userPool
    }
    const cognitoUser = new CognitoUser(userData)
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('JWT token: ' + result.getAccessToken().getJwtToken())
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        // dispatch(signin(token))
      },
      onFailure: (error) => {
        console.error(error.message)
        console.error(error.stack)
        if (onFailure && typeof onFailure === 'function') onFailure(error.message)
      },
      newPasswordRequired: () => {
        if (!onNewPasswordRequested || !(typeof onNewPasswordRequested === 'function')) {
          console.error('onNewPasswordRequested callback is not implemented')
          if (onFailure && typeof onFailure === 'function') {
            onFailure('Internal error. Please contact your admin.')
          }
          return
        }

        onNewPasswordRequested((newPassword, callbacks) => {
          setNewPassword(cognitoUser, newPassword, callbacks)
        })
      }
    })
  }
}

const setNewPassword = (cognitoUser, newPassword, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  if (onLoad && typeof onLoad === 'function') onLoad()

  cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
    onSuccess: (result) => {
      console.log('JWT token: ' + result.getAccessToken().getJwtToken())
      if (onSuccess && typeof onSuccess === 'function') onSuccess()
      // dispatch(signin(token))
    },
    onFailure: (error) => {
      if (error instanceof Error) {
        console.error(error.message)
        console.error(error.stack)
        if (onFailure && typeof onFailure === 'function') onFailure(error.message)
      } else {
        console.error(error)
        if (onFailure && typeof onFailure === 'function') onFailure(error)
      }
    }
  })
}
