import React, { PropTypes } from 'react'
import classnames from 'classnames'
import AutolinkedText from 'components/common/AutolinkedText'
import { getMaintenanceColor } from 'utils/status'
import { getDateTimeFormat } from 'utils/datetime'
import classes from './MaintenanceItem.scss'

export default class MaintenanceItem extends React.Component {
  static propTypes = {
    maintenance: PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string,
      maintenanceUpdates: PropTypes.arrayOf(PropTypes.shape({
        maintenanceUpdateID: PropTypes.string.isRequired,
        maintenanceStatus: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
      }).isRequired)
    }).isRequired
  }

  renderMaintenanceUpdateItem = (maintenanceUpdate) => {
    const message = (
      <span className={classnames(classes.inner_item_message)}> - <AutolinkedText text={maintenanceUpdate.message} />
      </span>
    )
    return (
      <div className={classnames(classes.inner_item)} key={maintenanceUpdate.maintenanceUpdateID}>
        <div>
          {maintenanceUpdate.maintenanceStatus}
          {message}
        </div>
        <div className={classnames(classes.inner_item_updatedat)}>
          {getDateTimeFormat(maintenanceUpdate.updatedAt)}
        </div>
      </div>
    )
  }

  render () {
    const { maintenance } = this.props
    const statusColor = getMaintenanceColor(maintenance.status)
    let maintenanceUpdateItems
    if (maintenance.hasOwnProperty('maintenanceUpdates')) {
      maintenanceUpdateItems = maintenance.maintenanceUpdates.map(this.renderMaintenanceUpdateItem)
    }
    const startAt = getDateTimeFormat(maintenance.startAt, 'MMM DD, HH:mm ')
    const endAt = getDateTimeFormat(maintenance.endAt, 'MMM DD, HH:mm (z)')

    return (
      <li className={classnames('mdl-list__item', 'mdl-list__item--two-line', 'mdl-shadow--4dp', classes.item)}>
        <div className={classes.item_headline}>
          <span className={classnames('mdl-list__item-primary-content', classes.item_primary)}
            style={{color: statusColor}}>
            {maintenance.name}
          </span>
          <span className={classnames('mdl-list__item-secondary-content', classes.item_secondary)}>
            Scheduled for {startAt} - {endAt}
          </span>
        </div>
        {maintenanceUpdateItems}
      </li>
    )
  }
}
