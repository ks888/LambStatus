import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Button from 'components/common/Button'
import Tooltip from 'components/common/Tooltip'
import { getFormattedDateTime } from 'utils/datetime'
import classes from './IncidentItem.scss'

export default class IncidentItem extends React.Component {
  static propTypes = {
    onUpdateClicked: PropTypes.func.isRequired,
    onDeleteClicked: PropTypes.func.isRequired,
    getIncidentColor: PropTypes.func.isRequired,
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
    const { incident, getIncidentColor } = this.props
    let statusColor = getIncidentColor(incident.status)
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
          <i className={classnames(classes['menu-icon'], 'material-icons')} onClick={this.handleClickUpdateButton}>
            edit
          </i>
          <i className={classnames(classes['menu-icon'], 'material-icons')} onClick={this.handleClickDeleteButton}>
            delete
          </i>
        </div>
      </li>
    )
  }
}
