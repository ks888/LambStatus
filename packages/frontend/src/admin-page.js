import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import createStore from 'store/createStore'
import AdminPageLayout from 'layouts/AdminPageLayout'
import Components from 'containers/Components'
import Incidents from 'containers/Incidents'
import Users from 'components/Users'
import Signin from 'containers/Signin'
import { isAuthorized } from 'actions/users'

// ========================================================
// Browser History Setup
// ========================================================
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: __BASENAME__
})

// ========================================================
// Store and History Instantiation
// ========================================================
// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the routerKey "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

// ========================================================
// Developer Tools Setup
// ========================================================
if (__DEBUG__) {
  if (window.devToolsExtension) {
    window.devToolsExtension.open()
  }
}

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

function requireAuth (nextState, replace) {
  isAuthorized(authorized => {
    if (!authorized) {
      replace({ pathname: '/signin' })
    }
  })
}

function guestOnly (nextState, replace) {
  isAuthorized(authorized => {
    if (authorized) {
      replace({ pathname: '/' })
    }
  })
}

let render = () => {
  const routes = (
    <Route path='/' component={AdminPageLayout}>
      <IndexRoute component={Components} onEnter={requireAuth} />
      <Route path='components' component={Components} onEnter={requireAuth} />
      <Route path='incidents' component={Incidents} onEnter={requireAuth} />
      <Route path='users' component={Users} onEnter={requireAuth} />
      <Route path='signin' component={Signin} onEnter={guestOnly} />
    </Route>
  )

  ReactDOM.render(
    <Provider store={store}>
      <div style={{ height: '100%' }}>
        <Router history={history} children={routes} />
      </div>
    </Provider>,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

    // Setup hot module replacement
    /*
    module.hot.accept('./routes', () => {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    })
    */
  }
}

// ========================================================
// Go!
// ========================================================

render()
