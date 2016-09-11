import React from 'react'
import classes from './ComponentDialog.scss'

export const ComponentDialog = (props) => (
  <dialog>
    <h4 className='mdl-dialog__title'><i className='material-icons'>add</i>
    Component</h4>
    <div className='mdl-dialog__content'>
      Comopnent Name
    </div>
    <div className='mdl-dialog__actions'>
      <button type='button' className='mdl-button'>Add</button>
    </div>
  </dialog>
)

ComponentDialog.propTypes = {
}

export default ComponentDialog
