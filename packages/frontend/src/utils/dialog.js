// Workaround for the limitation of the dialog polyfill.

export const dialogID = 'dialog-container'
export const innerDialogID = 'inner-dialog-container'

export const mountDialog = (dialog) => {
  if (dialog) {
    document.getElementById(dialogID).appendChild(dialog)

    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog)
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
