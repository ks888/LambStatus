import 'whatwg-fetch'
import { checkStatus } from 'utils/fetch'
import { apiURL } from 'utils/settings'

export const SIGNIN = 'SIGNIN'

export function signin (token) {
  return {
    type: SIGNIN,
    token
  }
}

export const fetchIncidents = (callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  if (true) return
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'signin')
      .then(checkStatus)
      .then(response => response.json())
      .then(token => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(signin(token))
      })
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          if (onFailure && typeof onFailure === 'function') onFailure(error.message)
        }
      })
  }
}
