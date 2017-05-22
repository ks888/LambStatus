import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/common/Button'
import RadioButtonGroup from 'components/common/RadioButtonGroup'
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
      description: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired
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
    this.props.postMetric(this.state.type, this.state.props, this.state.title, this.state.status,
                          this.state.unit, this.state.description, this.updateCallbacks)
  }

  handleClickEditButton = (e) => {
    this.props.updateMetric(this.props.metric.metricID, this.state.type, this.state.props,
                            this.state.title, this.state.status, this.state.unit,
                            this.state.description, this.props.metric.order, this.updateCallbacks)
  }

  handleHideDialog = () => {
    unmountDialog(ReactDOM.findDOMNode(this.refs.dialog))
    this.props.onClosed()
  }

  renderMetrics = () => {
    return (<CloudWatchMetricsSelector onChange={this.handleChangeProps} props={this.state.props} />)
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

    const typeSelector = (
      <div className={classes['metric-type']}>
        <RadioButtonGroup title='Metrics Type' candidates={monitoringServices}
          checkedCandidate={this.state.type} onClicked={this.handleChangeType} />
      </div>
    )
    const metrics = this.renderMetrics()

    const metricStatusSelector = (
      <div className={classes['metric-status']}>
        <RadioButtonGroup title='Metric Status' candidates={metricStatuses}
          checkedCandidate={this.state.status} onClicked={this.handleChangeStatus} />
      </div>
    )
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        {actionName} Metric
      </h2>
      <div className='mdl-dialog__content'>
        <ErrorMessage message={this.state.message} />
        {typeSelector}
        <div>
          {metrics}
        </div>
        <TextField label='Title' text={this.state.title} rows={1} onChange={this.handleChangeTitle} />
        <TextField label='Unit' text={this.state.unit} rows={1} onChange={this.handleChangeUnit} />
        <TextField label='Description (optional)' text={this.state.description} rows={2}
          onChange={this.handleChangeDescription} />
        {metricStatusSelector}
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={clickHandler} name={actionName}
          class='mdl-button--accent' disabled={this.state.isUpdating} />
        <Button onClick={this.handleHideDialog} name='Cancel' />
      </div>
    </dialog>)
  }
}
