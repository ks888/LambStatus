import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Button from 'components/common/Button'
import ErrorMessage from 'components/common/ErrorMessage'
import Tooltip from 'components/common/Tooltip'
import MetricDialog, { metricDialogType } from 'components/adminPage/MetricDialog'
import MetricPreviewDialog from 'components/adminPage/MetricPreviewDialog'
import FoolproofDialog from 'components/adminPage/FoolproofDialog'
import MenuIcon from 'components/adminPage/MenuIcon'
import { getMetricColor } from 'utils/status'
import { innerDialogID } from 'utils/dialog'
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
      type: PropTypes.string.isRequired,
      props: PropTypes.object,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      decimalPlaces: PropTypes.number.isRequired,
      order: PropTypes.number.isRequired
    }).isRequired).isRequired,
    fetchMetrics: PropTypes.func.isRequired,
    updateMetric: PropTypes.func.isRequired,
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

  callbacks = {
    onLoad: () => { this.setState({isFetching: true}) },
    onSuccess: () => { this.setState({isFetching: false}) },
    onFailure: (msg) => {
      this.setState({isFetching: false, message: msg})
    }
  }

  componentDidMount () {
    this.props.fetchMetrics(this.callbacks)
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

  handleClickArrowUpward = (i) => {
    if (i === 0) { return () => {} }
    return this.handleClickArrowDownward(i - 1)
  }

  handleClickArrowDownward = (i) => {
    return () => {
      if (i === this.props.metrics.length - 1) { return }
      const { metrics } = this.props
      const clickedMetric = metrics[i]
      const orderA = metrics[i + 1].order
      const orderB = (i + 2 < metrics.length ? metrics[i + 2].order : Math.floor(new Date().getTime() / 1000))
      const newOrder = Math.floor((orderA + orderB) / 2)

      const params = Object.assign({}, clickedMetric, {order: newOrder})
      this.props.updateMetric(params, this.callbacks)
    }
  }

  renderListItem = (metric, i) => {
    let statusColor = getMetricColor(metric.status)
    return (
      <li key={metric.metricID} className={classnames(classes.item, 'mdl-shadow--2dp')}>
        <div className={classes['primary-content']}>
          <i className={classnames(classes.icon, 'material-icons')}
            style={{color: statusColor}} data-tip={metric.status}>insert_chart</i>
          <Tooltip />
          <div>
            <div>{metric.title}</div>
            <div className={classes.subtitle}>{metric.description}</div>
          </div>
        </div>
        <div className={classes['secondary-content']}>
          <MenuIcon iconName='show_chart' description='Preview'
            onClick={this.handleShowPreviewDialog(metric.metricID)} />
          <MenuIcon iconName='edit' description='Edit' onClick={this.handleShowEditDialog(metric.metricID)} />
          <MenuIcon iconName='delete' description='Delete' onClick={this.handleShowDeleteDialog(metric.metricID)} />
          <MenuIcon iconName='arrow_upward' description='Move upward' onClick={this.handleClickArrowUpward(i)} />
          <MenuIcon iconName='arrow_downward' description='Move downward' onClick={this.handleClickArrowDownward(i)} />
        </div>
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
    const addButton = (<span><i className='material-icons'>add</i>Add</span>)

    return (
      <div className={classnames(classes.layout, 'mdl-grid')}
        style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
        <div className={classes.headline}>
          <h4>Metrics</h4>
          <span className={classes.showDialogButton}>
            <Button onClick={this.handleShowAddDialog()} name={addButton} class='mdl-button--accent' />
          </span>
        </div>
        <ErrorMessage message={this.state.message} />
        <ul className={classnames(classes.container, 'mdl-cell', 'mdl-cell--12-col')}>
          {metricItems}
        </ul>
        <div id={innerDialogID}>
          {dialog}
        </div>
      </div>
    )
  }
}
