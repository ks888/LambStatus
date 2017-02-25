import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/Button'
import MetricsGraph from 'containers/MetricsGraph'
import classes from './MetricPreviewDialog.scss'

class MetricPreviewDialog extends React.Component {
  static propTypes = {
    metricID: PropTypes.string.isRequired,
    onClosed: PropTypes.func.isRequired
  }

  componentDidMount () {
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      // dialog polyfill has a limitation that the dialog should have a child of parents without parents.
      // Here is a workaround for this limitation.
      document.getElementById('dialog-container').appendChild(dialog)

      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog)
      }
      dialog.showModal()
    }
  }

  handleHideDialog = () => {
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      dialog.close()
      document.getElementById('inner-dialog-container').appendChild(dialog)
    }
    this.props.onClosed()
  }

  render () {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Preview
      </h2>
      <div className='mdl-dialog__content'>
        <MetricsGraph metricID={this.props.metricID} timeframe='Day' />
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleHideDialog} name='Cancel' />
      </div>
    </dialog>)
  }
}

export default MetricPreviewDialog
