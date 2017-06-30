import { mountDialog, unmountDialog } from 'utils/dialog'

describe('utils/dialog', () => {
  const getElementByIdOrg = document.getElementById
  let appendChildSpy
  beforeEach(() => {
    appendChildSpy = sinon.spy()
    document.getElementById = () => { return { appendChild: appendChildSpy } }
  })

  afterEach(() => {
    document.getElementById = getElementByIdOrg
  })

  describe('mountDialog', () => {
    it('should call showModal().', () => {
      const dialogMock = { showModal: sinon.spy() }
      mountDialog(dialogMock)

      assert(appendChildSpy.calledOnce)
      assert(dialogMock.showModal.calledOnce)
    })

    it('should register dialog.', () => {
      const dialogPolyfillOrg = dialogPolyfill
      dialogPolyfill = { forceRegisterDialog: (dialog) => { dialog.showModal = sinon.spy() } }

      const dialogMock = {}
      mountDialog(dialogMock)

      assert(appendChildSpy.calledOnce)
      assert(dialogMock.showModal.calledOnce)

      dialogPolyfill = dialogPolyfillOrg
    })
  })

  describe('unmountDialog', () => {
    it('should close dialog.', () => {
      const dialogMock = { close: sinon.spy() }
      unmountDialog(dialogMock)

      assert(appendChildSpy.calledOnce)
      assert(dialogMock.close.calledOnce)
    })
  })
})
