// Workaround for the limitation of the dialog polyfill.
import dialogPolyfill from 'dialog-polyfill/dialog-polyfill'
import 'dialog-polyfill/dialog-polyfill.css'

export const dialogID = 'dialog-container'
export const innerDialogID = 'inner-dialog-container'

export const mountDialog = (dialog) => {
  if (dialog) {
    document.getElementById(dialogID).appendChild(dialog)

    if (typeof HTMLDialogElement === 'function' || !dialog.showModal) {
      // There is some difference between dialog and its polyfill, and it breaks our layout.
      // To avoid this issue, always use polyfill.
      dialogPolyfill.forceRegisterDialog(dialog)
    }

    dialog.showModal()
  }
}

export const unmountDialog = (dialog) => {
  if (dialog) {
    dialog.close()
    document.getElementById(innerDialogID).appendChild(dialog)
  }
}
