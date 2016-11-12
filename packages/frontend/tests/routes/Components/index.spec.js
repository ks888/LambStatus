import ComponentsRoute from 'routes/Components'

describe('(Route) Components', () => {
  let _route

  beforeEach(() => {
    _route = ComponentsRoute({})
  })

  it('Should return a route configuration object', () => {
    expect(typeof(_route)).to.equal('object')
  })

  it('Configuration should contain path `counter`', () => {
    expect(_route.path).to.equal('counter')
  })

})
