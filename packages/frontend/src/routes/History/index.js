import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'history',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const components = require('./components/History').default
      const reducer = require('./modules/history').default

      injectReducer(store, { key: 'history', reducer })

      /*  Return getComponent   */
      cb(null, components)

    /* Webpack named bundle   */
    }, 'history')
  }
})
