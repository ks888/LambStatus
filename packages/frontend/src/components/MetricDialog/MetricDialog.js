import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './MetricDialog.scss'
import Button from 'components/Button'
import RadioButton from 'components/RadioButton'
import TextField from 'components/TextField'
import ErrorMessage from 'components/ErrorMessage'
import CloudWatchMetricsSelector from 'containers/CloudWatchMetricsSelector'
import { monitoringServices, metricStatuses } from 'utils/status'

export const dialogType = {
  add: 1,
  edit: 2
}

class MetricDialog extends React.Component {
  static propTypes = {
    onClosed: PropTypes.func.isRequired,
    metricID: PropTypes.string,
    metric: PropTypes.shape({
      metricID: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      props: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }),
    dialogType: PropTypes.number.isRequired,
    postMetric: PropTypes.func.isRequired,
    updateMetric: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    if (props.metric) {
      this.state = {
        type: props.metric.type,
        props: props.metric.props,
        title: props.metric.title,
        status: props.metric.status,
        unit: props.metric.unit,
        description: props.metric.description
      }
    } else {
      this.state = {
        type: monitoringServices[0],
        props: null,
        title: '',
        status: metricStatuses[0],
        unit: '',
        description: ''
      }
    }
    this.state.isUpdating = false
    this.state.message = ''
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

  handleChangeType = (value) => {
    this.setState({type: value})
  }

  handleChangeProps = (value) => {
    this.setState({
      props: Object.assign({}, this.state.props, value)
    })
  }

  handleChangeTitle = (value) => {
    this.setState({title: value})
  }

  handleChangeStatus = (value) => {
    this.setState({status: value})
  }

  handleChangeUnit = (value) => {
    this.setState({unit: value})
  }

  handleChangeDescription = (value) => {
    this.setState({description: value})
  }

  updateCallbacks = {
    onLoad: () => { this.setState({isUpdating: true}) },
    onSuccess: () => {
      this.setState({isUpdating: false})
      this.handleHideDialog()
    },
    onFailure: (msg) => {
      this.setState({isUpdating: false, message: msg})
    }
  }

  handleClickAddButton = (e) => {
    this.props.postMetric(this.state.type,
                          this.state.props,
                          this.state.title,
                          this.state.status,
                          this.state.unit,
                          this.state.description,
                          this.updateCallbacks)
  }

  handleClickEditButton = (e) => {
    this.props.updateMetric(this.props.metric.metricID,
                            this.state.type,
                            this.state.props,
                            this.state.title,
                            this.state.status,
                            this.state.unit,
                            this.state.description,
                            this.updateCallbacks)
  }

  handleHideDialog = () => {
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      dialog.close()
      document.getElementById('inner-dialog-container').appendChild(dialog)
    }
    this.props.onClosed()
  }

  renderTypes = () => {
    const types = monitoringServices.map((type) => {
      let checked = type === this.state.type
      return (
        <RadioButton key={type} onChange={this.handleChangeType} label={type} checked={checked} groupName='types' />
      )
    })
    return (
      <div className={classes['metric-type']}>
        <label className={classes.label} htmlFor='types'>
          Metrics Type
        </label>
        <div className={classes.status} id='types'>
          {types}
        </div>
      </div>
    )
  }

  renderMetrics = () => {
    return (<CloudWatchMetricsSelector onChange={this.handleChangeProps} props={this.state.props} />)
  }

  renderMetricStatuses = () => {
    const statusDOMs = metricStatuses.map((status) => {
      let checked = status === this.state.status
      return (
        <RadioButton key={status} onChange={this.handleChangeStatus} label={status} checked={checked} groupName='status' />
      )
    })
    return (
      <div>
        <label className={classes.label} htmlFor='statuses'>
          Metric Status
        </label>
        <div className={classes.status} id='statuses'>
          {statusDOMs}
        </div>
      </div>
    )
  }

  render () {
    let actionName, clickHandler
    switch (this.props.dialogType) {
      case dialogType.add:
        actionName = 'Add'
        clickHandler = this.handleClickAddButton
        break
      case dialogType.edit:
        actionName = 'Edit'
        clickHandler = this.handleClickEditButton
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }

    const types = this.renderTypes()
    const metrics = this.renderMetrics()
    const metricStatuses = this.renderMetricStatuses()
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        {actionName} Metric
      </h2>
      <div className='mdl-dialog__content'>
            <ErrorMessage message={this.state.message} />
            {types}
            {metrics}
            <TextField label='Title' text={this.state.title} rows={1} onChange={this.handleChangeTitle} />
            <TextField label='Unit' text={this.state.unit} rows={1} onChange={this.handleChangeUnit} />
            <TextField label='Description (optional)' text={this.state.description} rows={2} onChange={this.handleChangeDescription} />
            {metricStatuses}
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={clickHandler} name={actionName}
          class='mdl-button--accent' disabled={this.state.isUpdating} />
        <Button onClick={this.handleHideDialog} name='Cancel' />
      </div>
    </dialog>)
  }
}

export default MetricDialog
