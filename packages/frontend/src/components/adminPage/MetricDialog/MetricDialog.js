import React, { PropTypes } from 'react'
import ReactTooltip from 'react-tooltip'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/common/Button'
import LabeledDropdownList from 'components/common/LabeledDropdownList'
import RadioButtonGroup from 'components/common/RadioButtonGroup'
import TextWithLabel from 'components/common/TextWithLabel'
import TextField from 'components/common/TextField'
import ErrorMessage from 'components/common/ErrorMessage'
import { monitoringServiceManager } from 'components/adminPage/MonitoringService'
import { metricStatuses } from 'utils/status'
import { mountDialog, unmountDialog } from 'utils/dialog'
import classes from './MetricDialog.scss'

export const dialogType = {
  add: 1,
  edit: 2
}

const decimalPlacesList = [0, 1, 2, 3, 4]

export default class MetricDialog extends React.Component {
  static propTypes = {
    onClosed: PropTypes.func.isRequired,
    metricID: PropTypes.string,
    metric: PropTypes.shape({
      metricID: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      props: PropTypes.object,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      decimalPlaces: PropTypes.number.isRequired,
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
        description: props.metric.description,
        decimalPlaces: props.metric.decimalPlaces
      }
    } else {
      this.state = {
        type: monitoringServiceManager.listServices()[0],
        props: null,
        title: '',
        status: metricStatuses[0],
        unit: '',
        description: '',
        decimalPlaces: decimalPlacesList[0]
      }
    }
    this.state.isUpdating = false
    this.state.showAdvancedOption = false
    this.state.message = ''
  }

  componentDidMount () {
    mountDialog(ReactDOM.findDOMNode(this.refs.dialog))
  }

  handleChangeType = (value) => {
    this.setState({type: value})
  }

  handleChangeProps = (value) => {
    this.setState({props: value})
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

  handleChangeDecimalPlaces = (value) => {
    this.setState({decimalPlaces: parseInt(value, 10)})
  }

  handleChangeAdvancedOption = (value) => {
    this.setState({showAdvancedOption: !this.state.showAdvancedOption})
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
    this.props.postMetric(this.state, this.updateCallbacks)
  }

  handleClickEditButton = (e) => {
    const params = Object.assign({}, this.props.metric, this.state)
    this.props.updateMetric(params, this.updateCallbacks)
  }

  handleHideDialog = () => {
    unmountDialog(ReactDOM.findDOMNode(this.refs.dialog))
    this.props.onClosed()
  }

  renderMetrics = () => {
    const service = monitoringServiceManager.create(this.state.type)
    const Selector = service.getMetricsSelector()
    return (
      <Selector onChange={this.handleChangeProps} props={this.state.props} />
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

    let metricID
    if (this.props.metricID) {
      metricID = (<TextWithLabel label='Metric ID' text={this.props.metricID} />)
    }
    const typeSelector = (
      <div className={classes['metric-type']}>
        <RadioButtonGroup title='Metrics Type' candidates={monitoringServiceManager.listServices()}
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

    let advancedOptions
    let advancedIcon = 'expand_more'
    if (this.state.showAdvancedOption) {
      advancedOptions = (
        <div>
          <TextField label='Unit' text={this.state.unit} rows={1} onChange={this.handleChangeUnit} />
          <TextField
            label='Description' text={this.state.description} rows={2}
            onChange={this.handleChangeDescription} />
          <LabeledDropdownList
            id='decimalPlaces' label='Decimal Places' onChange={this.handleChangeDecimalPlaces}
            list={decimalPlacesList} initialValue={this.state.decimalPlaces} infoIconID='decimalPlacesInfo' />
          <ReactTooltip
            id='decimalPlacesInfo' effect='solid' place='right' delayHide={5000} className={classes.tooltip}>
            <div>
              This value is used on displaying graphs. The data to be collected is unaffected.
            </div>
          </ReactTooltip>
        </div>
      )
      advancedIcon = 'expand_less'
    }
    return (
      <dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
        <h2 className={classnames('mdl-dialog__title', classes.title)}>
          {actionName} Metric
        </h2>
        <div className='mdl-dialog__content'>
          <ErrorMessage message={this.state.message} />
          {metricID}
          {typeSelector}
          <div>
            {metrics}
          </div>
          <TextField label='Title' text={this.state.title} rows={1} onChange={this.handleChangeTitle} />
          {metricStatusSelector}
          <div className={classes.advanced} onClick={this.handleChangeAdvancedOption}>
            Advanced <i className={classnames(classes.icon, 'material-icons')}>{advancedIcon}</i>
          </div>
          {advancedOptions}
        </div>
        <div className='mdl-dialog__actions'>
          <Button onClick={clickHandler} name={actionName}
            class='mdl-button--accent' disabled={this.state.isUpdating} />
          <Button onClick={this.handleHideDialog} name='Cancel' />
        </div>
      </dialog>
    )
  }
}
