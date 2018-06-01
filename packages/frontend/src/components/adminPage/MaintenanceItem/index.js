import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Tooltip from 'components/common/Tooltip'
import MenuIcon from 'components/adminPage/MenuIcon'
import { getFormattedDateTime } from 'utils/datetime'
import { getMaintenanceColor as getStatusColor } from 'utils/status'
import classes from './MaintenanceItem.scss'

export default class MaintenanceItem extends React.Component {
  static propTypes = {
    onUpdateClicked: PropTypes.func.isRequired,
    onDeleteClicked: PropTypes.func.isRequired,
    maintenance: PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      startAt: PropTypes.string.isRequired,
      endAt: PropTypes.string.isRequired
    }).isRequired
  }

  handleClickUpdateButton = () => {
    this.props.onUpdateClicked()
  }

  handleClickDeleteButton = () => {
    this.props.onDeleteClicked()
  }

  render () {
    const { maintenance } = this.props
    let statusColor = getStatusColor(maintenance.status)
    const startAt = getFormattedDateTime(maintenance.startAt, 'MMM DD, HH:mm')
    const endAt = getFormattedDateTime(maintenance.endAt, 'MMM DD, HH:mm (z)')
    return (
      <li className={classnames(classes.item, 'mdl-shadow--2dp')}>
        <div className={classes['primary-content']}>
          <i className={classnames(classes.icon, 'material-icons')}
            style={{ color: statusColor }} data-tip={maintenance.status}>report</i>
          <Tooltip />
          <div>
            <div>{maintenance.name}</div>
            <div className={classes.subtitle}>
              scheduled for {startAt} - {endAt}
            </div>
          </div>
        </div>
        <div className={classes['secondary-content']}>
          <MenuIcon iconName='edit' description='Edit' onClick={this.handleClickUpdateButton} />
          <MenuIcon iconName='delete' description='Delete' onClick={this.handleClickDeleteButton} />
        </div>
      </li>
    )
  }
}
