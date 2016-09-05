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
      const components = require('./containers/ComponentsContainer').default
      const reducer = require('./modules/components').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'components', reducer })

      /*  Return getComponent   */
      cb(null, components)

    /* Webpack named bundle   */
    }, 'components')
  }
})
