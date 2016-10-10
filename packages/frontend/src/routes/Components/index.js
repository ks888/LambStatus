import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'components',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const components = require('./components/Components').default
      const reducer = require('./modules/components').default

      injectReducer(store, { key: 'components', reducer })

      /*  Return getComponent   */
      cb(null, components)

    /* Webpack named bundle   */
    }, 'components')
  }
})
