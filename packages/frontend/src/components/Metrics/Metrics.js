import React, { PropTypes } from 'react'
import classnames from 'classnames'
//import MetricDialog from 'containers/MetricDialog'
import MetricDialog from 'containers/ComponentDialog'
//import { metricDialogType } from 'components/MetricDialog'
import { metricDialogType } from 'components/ComponentDialog'
import FoolproofDialog from 'components/FoolproofDialog'
import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import { getMetricColor } from 'utils/status'
import classes from './Metrics.scss'

const dialogType = {
  none: 0,
  add: 1,
  edit: 2,
  delete: 3
}

export default class Metrics extends React.Component {
  static propTypes = {
    metrics: PropTypes.arrayOf(PropTypes.shape({
      metricID: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }).isRequired).isRequired,
    fetchMetrics: PropTypes.func.isRequired,
    deleteMetric: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      dialogType: dialogType.none,
      metric: null,
      isFetching: false,
      message: ''
    }
  }

  componentDidMount () {
    this.props.fetchMetrics({
      onLoad: () => { this.setState({isFetching: true}) },
      onSuccess: () => { this.setState({isFetching: false}) },
      onFailure: (msg) => {
        this.setState({isFetching: false, message: msg})
      }
    })
  }

  handleShowDialog = (type, metric) => {
    this.setState({ metric: metric, dialogType: type })
  }

  handleShowAddDialog = () => {
    return () => this.handleShowDialog(dialogType.add)
  }

  handleShowEditDialog = (metric) => {
    return () => this.handleShowDialog(dialogType.edit, metric)
  }

  handleShowDeleteDialog = (metric) => {
    return () => this.handleShowDialog(dialogType.delete, metric)
  }

  handleCloseDialog = () => {
    this.setState({ metric: null, dialogType: dialogType.none })
  }

  renderListItem = (metric) => {
    let statusColor = getMetricColor(metric.status)
    return (
      <li key={metric.metricID} className='mdl-list__item mdl-list__item--two-line mdl-shadow--2dp'>
        <span className='mdl-list__item-primary-content'>
          <i className={classnames(classes.icon, 'material-icons', 'mdl-list__item-avatar')}
            style={{color: statusColor}}>insert_chart</i>
          <span>{metric.title}</span>
          <span className='mdl-list__item-sub-title'>{metric.description}</span>
        </span>
        <span className='mdl-list__item-secondary-content'>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Edit'
                onClick={this.handleShowEditDialog(metric)} />
            </div>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Delete'
                onClick={this.handleShowDeleteDialog(metric)} />
            </div>
          </div>
        </span>
      </li>
    )
  }

  renderDialog = () => {
    let dialog
    switch (this.state.dialogType) {
      case dialogType.none:
        dialog = null
        break
      case dialogType.add:
        dialog = <MetricDialog onClosed={this.handleCloseDialog}
          dialogType={metricDialogType.add} />
        break
      case dialogType.edit:
        dialog = <MetricDialog onClosed={this.handleCloseDialog}
          metric={this.state.metric} dialogType={metricDialogType.edit} />
        break
      case dialogType.delete:
        dialog = <FoolproofDialog onClosed={this.handleCloseDialog}
          name={this.state.metric.name} ID={this.state.metric.metricID}
          deleteFunction={this.props.deleteMetric} />
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }
    return dialog
  }

  render () {
    const { metrics } = this.props
    const metricItems = metrics.map(this.renderListItem)
    const dialog = this.renderDialog()
    const textInButton = (<div>
      <i className='material-icons'>add</i>
      Metric
    </div>)

    return (<div className={classnames(classes.layout, 'mdl-grid')}
      style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--9-col mdl-cell--middle'>
        <h4>Metrics</h4>
      </div>
      <div className={classnames(classes.showDialogButton, 'mdl-cell mdl-cell--3-col mdl-cell--middle')}>
        <Button onClick={this.handleShowAddDialog()} name={textInButton} class='mdl-button--accent' />
      </div>
      <div className='mdl-cell mdl-cell--12-col mdl-list'>
        <ErrorMessage message={this.state.message} />
      </div>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {metricItems}
      </ul>
      <div id='inner-dialog-container'>
        {dialog}
      </div>
    </div>)
  }
}
