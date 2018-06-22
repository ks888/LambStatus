import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Tooltip from 'components/common/Tooltip'
import MenuIcon from 'components/adminPage/MenuIcon'
import { getFormattedDateTime } from 'utils/datetime'
import { getIncidentColor as getStatusColor } from 'utils/status'
import classes from './IncidentItem.scss'

export default class IncidentItem extends React.Component {
  static propTypes = {
    onUpdateClicked: PropTypes.func.isRequired,
    onDeleteClicked: PropTypes.func.isRequired,
    incident: PropTypes.shape({
      incidentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired
  }

  handleClickUpdateButton = () => {
    this.props.onUpdateClicked()
  }

  handleClickDeleteButton = () => {
    this.props.onDeleteClicked()
  }

  render () {
    const { incident } = this.props
    let statusColor = getStatusColor(incident.status)

    return (
      <li className={classnames(classes.item, 'mdl-shadow--2dp')}>
        <div className={classes['primary-content']}>
          <i className={classnames(classes.icon, 'material-icons')}
            style={{ color: statusColor }} data-tip={incident.status}>report</i>
          <Tooltip />
          <div>
            <div>{incident.name}</div>
            <div className={classes.subtitle}>
              updated at {getFormattedDateTime(incident.updatedAt)}
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
