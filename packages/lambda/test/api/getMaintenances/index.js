import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getMaintenances'
import { Maintenances, Maintenance } from 'model/maintenances'

describe('getMaintenances', () => {
  afterEach(() => {
    Maintenances.prototype.all.restore()
  })

  it('should return a list of maintenances', async () => {
    const maintenances = [
      new Maintenance('1', undefined, undefined, undefined, undefined, undefined, [], '1')
    ]
    sinon.stub(Maintenances.prototype, 'all').returns(maintenances.slice(0))

    return await handle({}, null, (error, result) => {
      assert(error === null)
      assert.deepEqual(result, [maintenances[0].objectify()])
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Maintenances.prototype, 'all').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
