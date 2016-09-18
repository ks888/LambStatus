import React, { PropTypes } from 'react'
import classnames from 'classnames'
import classes from './FoolproofDialog.scss'
import Button from 'components/Button'

class FoolproofDialog extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickDeleteButton = this.handleClickDeleteButton.bind(this)
  }

  handleClickDeleteButton () {
    this.props.onCompleted(this.props.component.id)
  }

  render () {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)}>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Delete {this.props.component.name}
      </h2>
      <div className='mdl-dialog__content'>
        This operation can not be undone.
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleClickDeleteButton} name='DELETE' class='mdl-button--accent' />
        <Button onClick={this.props.onCanceled} name='Cancel' />
      </div>
    </dialog>)
  }
}

FoolproofDialog.propTypes = {
  onCompleted: PropTypes.func.isRequired,
  onCanceled: PropTypes.func.isRequired,
  component: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired
}

export default FoolproofDialog
