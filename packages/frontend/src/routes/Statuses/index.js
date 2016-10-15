import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'statuses',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const components = require('./components/Statuses').default
      const reducer = require('./modules/statuses').default

      injectReducer(store, { key: 'statuses', reducer })

      /*  Return getComponent   */
      cb(null, components)

    /* Webpack named bundle   */
    }, 'statuses')
  }
})
