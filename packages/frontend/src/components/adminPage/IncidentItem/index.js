import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Button from 'components/common/Button'
import { getIncidentColor } from 'utils/status'
import { getDateTimeFormat } from 'utils/datetime'
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
    let statusColor = getIncidentColor(incident.status)
    return (
      <li className='mdl-list__item mdl-list__item--two-line mdl-shadow--2dp'>
        <span className='mdl-list__item-primary-content'>
          <i className={classnames(classes.icon, 'material-icons', 'mdl-list__item-avatar')}
            style={{ color: statusColor }}>brightness_1</i>
          <span>{incident.name}</span>
          <span className='mdl-list__item-sub-title'>
            updated at {getDateTimeFormat(incident.updatedAt)}
          </span>
        </span>
        <span className='mdl-list__item-secondary-content'>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Update'
                onClick={this.handleClickUpdateButton} />
            </div>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Delete'
                onClick={this.handleClickDeleteButton} />
            </div>
          </div>
        </span>
      </li>
    )
  }
}
