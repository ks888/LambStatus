import ComponentsRoute from 'routes/Components'
import * as reducers from 'store/reducers'
import components from 'routes/Components/components/Components'
import componentsReducer from 'routes/Components/modules/components'

describe('(Route) Components', () => {
  let _route, orgInjectReducer

  beforeEach(() => {
    orgInjectReducer = reducers.injectReducer
    reducers.injectReducer = sinon.spy()
    _route = ComponentsRoute({})
  })

  afterEach(() => {
    reducers.injectReducer = orgInjectReducer
  })

  it('Should return a route configuration object', () => {
    expect(typeof(_route)).to.equal('object')
  })

  it('Configuration should contain path `components`', () => {
    expect(_route.path).to.equal('components')
  })

  it('getComponent should set components as callback args', () => {
    let cbSpy = sinon.spy()
    _route.getComponent(null, cbSpy)
    expect(cbSpy.firstCall.args[0]).to.equal(null)
    expect(cbSpy.firstCall.args[1]).to.equal(components)
  })

  it('getComponent should inject reducers', () => {
    _route.getComponent(null, () => {})
    const { key, reducer } = reducers.injectReducer.firstCall.args[1]
    expect(key).to.equal('components')
    expect(reducer).to.equal(componentsReducer)
  })
})
