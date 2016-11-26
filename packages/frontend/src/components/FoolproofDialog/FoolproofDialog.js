import React, { PropTypes } from 'react'
import classnames from 'classnames'
import classes from './FoolproofDialog.scss'
import Button from 'components/Button'

class FoolproofDialog extends React.Component {
  handleClickDeleteButton = () => {
    this.props.onCompleted(this.props.ID)
  }

  render () {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)}>
      <h4 className={classnames('mdl-dialog__title', classes.title)}>
        Delete <i>{this.props.name}</i> ?
      </h4>
      <div className='mdl-dialog__content'>
        This operation can not be undone.
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleClickDeleteButton} name='DELETE'
          class='mdl-button--accent' disabled={this.props.isUpdating} />
        <Button onClick={this.props.onCanceled} name='Cancel' />
      </div>
    </dialog>)
  }
}

FoolproofDialog.propTypes = {
  onCompleted: PropTypes.func.isRequired,
  onCanceled: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  ID: PropTypes.string.isRequired,
  isUpdating: PropTypes.bool.isRequired
}

export default FoolproofDialog
