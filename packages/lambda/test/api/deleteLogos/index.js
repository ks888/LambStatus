import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/deleteLogos'
import { SettingsProxy } from 'api/utils'

describe('deleteLogos', () => {
  let deleteLogoIDStub

  beforeEach(() => {
    deleteLogoIDStub = sinon.stub(SettingsProxy.prototype, 'deleteLogoID')
  })

  afterEach(() => {
    SettingsProxy.prototype.deleteLogoID.restore()
  })

  it('should delete the metric', async () => {
    let err
    await handle({}, null, error => {
      err = error
    })
    assert(err === undefined)
    assert(deleteLogoIDStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    deleteLogoIDStub.throws()

    let err
    await handle({}, null, (error, result) => {
      err = error
    })
    assert(err.match(/Error/))
  })
})
