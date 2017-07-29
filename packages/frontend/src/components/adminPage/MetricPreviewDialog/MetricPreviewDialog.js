import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import MetricsGraph from 'components/common/MetricsGraph'
import Button from 'components/common/Button'
import RadioButton from 'components/common/RadioButton'
import { monitoringServiceManager } from 'components/adminPage/MonitoringService'
import { timeframes } from 'utils/status'
import { mountDialog, unmountDialog } from 'utils/dialog'
import classes from './MetricPreviewDialog.scss'

export default class MetricPreviewDialog extends React.Component {
  static propTypes = {
    metricID: PropTypes.string.isRequired,
    metric: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }),
    onClosed: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { timeframe: timeframes[0] }
  }

  componentDidMount () {
    mountDialog(ReactDOM.findDOMNode(this.refs.dialog))
  }

  handleChangeTimeframe = (value) => {
    this.setState({timeframe: value})
  }

  handleHideDialog = () => {
    unmountDialog(ReactDOM.findDOMNode(this.refs.dialog))
    this.props.onClosed()
  }

  renderMessage = () => {
    const service = monitoringServiceManager.create(this.props.metric.type)
    const Message = service.getMessageInPreviewDialog()
    return (
      <Message metricID={this.props.metric.metricID} />
    )
  }

  render () {
    const timeframesSelector = timeframes.map((timeframe) => {
      let checked = timeframe === this.state.timeframe
      return (
        <RadioButton key={timeframe} onChange={this.handleChangeTimeframe} label={timeframe}
          checked={checked} groupName='timeframes' />
      )
    })

    const message = this.renderMessage()

    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Preview
      </h2>
      <div className='mdl-dialog__content'>
        <div className={classes.timeframes}>
          {timeframesSelector}
        </div>
        <div className='mdl-list'>
          <MetricsGraph metricID={this.props.metric.metricID} timeframe={this.state.timeframe} />
        </div>
        {message}
        <div className='mdl-dialog__actions'>
          <Button onClick={this.handleHideDialog} name='Cancel' />
        </div>
      </div>
    </dialog>)
  }
}
