import dialogPolyfill from 'dialog-polyfill/dialog-polyfill'
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
      const dialogPolyfillOrg = dialogPolyfill
      const forceRegisterDialogSpy = sinon.spy()
      dialogPolyfill = { forceRegisterDialog: forceRegisterDialogSpy }

      const dialogMock = { showModal: sinon.spy() }
      mountDialog(dialogMock)

      assert(appendChildSpy.calledOnce)
      assert(dialogMock.showModal.calledOnce)
      assert(dialogPolyfill.forceRegisterDialog.calledOnce)

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
