import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import AutolinkedText from 'components/common/AutolinkedText'
import Button from 'components/common/Button'
import { getMaintenanceColor } from 'utils/status'
import { getDateTimeFormat } from 'utils/datetime'
import classes from './MaintenanceItem.scss'

export default class MaintenanceItem extends React.Component {
  static propTypes = {
    maintenanceID: PropTypes.string.isRequired,
    maintenance: PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string,
      updatedAt: PropTypes.string.isRequired,
      startAt: PropTypes.string.isRequired,
      endAt: PropTypes.string.isRequired,
      maintenanceUpdates: PropTypes.arrayOf(PropTypes.shape({
        maintenanceUpdateID: PropTypes.string.isRequired,
        maintenanceStatus: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
      }).isRequired)
    }).isRequired,
    autoloadDetail: PropTypes.bool,
    fetchMaintenanceUpdates: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (this.props.autoloadDetail) {
      this.props.fetchMaintenanceUpdates(this.props.maintenance.maintenanceID)
    }
  }

  handleClickDetailButton = () => {
    this.props.fetchMaintenanceUpdates(this.props.maintenance.maintenanceID)
  }

  renderMaintenanceUpdateItem = (maintUpdate) => {
    return (
      <div className={classnames(classes.inner_item)} key={maintUpdate.maintenanceUpdateID}>
        <div>
          {maintUpdate.maintenanceStatus}
          <span className={classnames(classes.inner_item_message)}> - <AutolinkedText text={maintUpdate.message} />
          </span>
        </div>
        <div className={classnames(classes.inner_item_updatedat)}>
          {getDateTimeFormat(maintUpdate.updatedAt)}
        </div>
      </div>
    )
  }

  render () {
    const { maintenance } = this.props
    const statusColor = getMaintenanceColor(maintenance.status)
    let maintenanceUpdateItems, detailButton
    if (maintenance.hasOwnProperty('maintenanceUpdates')) {
      maintenanceUpdateItems = maintenance.maintenanceUpdates.map(this.renderMaintenanceUpdateItem)
    } else if (this.props.autoloadDetail) {
      // now loading...
    } else {
      detailButton = (
        <span className='mdl-list__item-secondary-content'>
          <Button plain name='Detail' onClick={this.handleClickDetailButton} />
        </span>
      )
    }
    const startAt = getDateTimeFormat(maintenance.startAt, 'MMM DD, HH:mm ')
    const endAt = getDateTimeFormat(maintenance.endAt, 'MMM DD, HH:mm (z)')

    return (
      <li className={classnames('mdl-list__item', 'mdl-list__item--two-line', 'mdl-shadow--4dp', classes.item)}>
        <div className={classes.item_headline}>
          <span className={classnames('mdl-list__item-primary-content', classes.item_primary)}>
            <Link to={`/maintenances/${this.props.maintenanceID}`} className={classes.item_primary_link}
              style={{color: statusColor}}>
              {maintenance.status} - {maintenance.name}
            </Link>
          </span>
          <span className={classnames('mdl-list__item-secondary-content', classes.item_secondary)}>
            Scheduled for {startAt} - {endAt}
          </span>
          {detailButton}
        </div>
        {maintenanceUpdateItems}
      </li>
    )
  }
}
