import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/common/Button'
import RadioButton from 'components/common/RadioButton'
import TextField from 'components/common/TextField'
import ErrorMessage from 'components/common/ErrorMessage'
import CloudWatchMetricsSelector from 'components/adminPage/CloudWatchMetricsSelector'
import { monitoringServices, metricStatuses } from 'utils/status'
import { mountDialog, unmountDialog } from 'utils/dialog'
import classes from './MetricDialog.scss'

export const dialogType = {
  add: 1,
  edit: 2
}

export default class MetricDialog extends React.Component {
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
    mountDialog(ReactDOM.findDOMNode(this.refs.dialog))
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
    unmountDialog(ReactDOM.findDOMNode(this.refs.dialog))
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
        <RadioButton key={status} onChange={this.handleChangeStatus} label={status}
          checked={checked} groupName='status' />
      )
    })
    return (
      <div className={classes['metric-statuses']}>
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
        console.warn('unknown dialog type: ', this.props.dialogType)
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
        <div className={classes.metrics}>
          {metrics}
        </div>
        <TextField label='Title' text={this.state.title} rows={1} onChange={this.handleChangeTitle} />
        <TextField label='Unit' text={this.state.unit} rows={1} onChange={this.handleChangeUnit} />
        <TextField label='Description (optional)' text={this.state.description} rows={2}
          onChange={this.handleChangeDescription} />
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
