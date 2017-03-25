import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Button from 'components/common/Button'
import ErrorMessage from 'components/common/ErrorMessage'
import MetricDialog, { metricDialogType } from 'components/adminPage/MetricDialog'
import MetricPreviewDialog from 'components/adminPage/MetricPreviewDialog'
import FoolproofDialog from 'components/adminPage/FoolproofDialog'
import { getMetricColor } from 'utils/status'
import classes from './Metrics.scss'

const dialogType = {
  none: 0,
  add: 1,
  preview: 2,
  edit: 3,
  delete: 4
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
      metricID: null,
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

  handleShowDialog = (type, metricID) => {
    this.setState({ metricID, dialogType: type })
  }

  handleShowAddDialog = () => {
    return () => this.handleShowDialog(dialogType.add)
  }

  handleShowPreviewDialog = (metricID) => {
    return () => this.handleShowDialog(dialogType.preview, metricID)
  }

  handleShowEditDialog = (metricID) => {
    return () => this.handleShowDialog(dialogType.edit, metricID)
  }

  handleShowDeleteDialog = (metricID) => {
    return () => this.handleShowDialog(dialogType.delete, metricID)
  }

  handleCloseDialog = () => {
    this.setState({ metricID: null, dialogType: dialogType.none })
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
            <div className='mdl-cell mdl-cell--4-col'>
              <Button plain name='Preview'
                onClick={this.handleShowPreviewDialog(metric.metricID)} />
            </div>
            <div className='mdl-cell mdl-cell--3-col'>
              <Button plain name='Edit'
                onClick={this.handleShowEditDialog(metric.metricID)} />
            </div>
            <div className='mdl-cell mdl-cell--5-col'>
              <Button plain name='Delete'
                onClick={this.handleShowDeleteDialog(metric.metricID)} />
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
      case dialogType.preview:
        dialog = <MetricPreviewDialog onClosed={this.handleCloseDialog} metricID={this.state.metricID} />
        break
      case dialogType.edit:
        dialog = <MetricDialog onClosed={this.handleCloseDialog}
          metricID={this.state.metricID} dialogType={metricDialogType.edit} />
        break
      case dialogType.delete:
        let metricName
        this.props.metrics.forEach((metric) => {
          if (metric.metricID === this.state.metricID) {
            metricName = metric.title
          }
        })
        dialog = <FoolproofDialog onClosed={this.handleCloseDialog}
          name={metricName} ID={this.state.metricID}
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
