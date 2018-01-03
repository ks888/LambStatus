import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import Button from 'components/common/Button'
import AutolinkedText from 'components/common/AutolinkedText'
import { getIncidentColor } from 'utils/status'
import { getFormattedDateTime } from 'utils/datetime'
import classes from './IncidentItem.scss'

export default class IncidentItem extends React.Component {
  static propTypes = {
    incidentID: PropTypes.string.isRequired,
    incident: PropTypes.shape({
      incidentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string,
      updatedAt: PropTypes.string,
      incidentUpdates: PropTypes.arrayOf(PropTypes.shape({
        incidentUpdateID: PropTypes.string.isRequired,
        incidentStatus: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
      }).isRequired)
    }).isRequired,
    autoloadDetail: PropTypes.bool,
    fetchIncident: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (this.props.autoloadDetail) {
      this.props.fetchIncident(this.props.incident.incidentID)
    }
  }

  handleClickDetailButton = () => {
    this.props.fetchIncident(this.props.incident.incidentID)
  }

  renderIncidentUpdateItem = (incidentUpdate) => {
    return (
      <div className={classes['update-item']} key={incidentUpdate.incidentUpdateID}>
        <div>
          {incidentUpdate.incidentStatus}
          <span className={classes['update-item-message']}> - <AutolinkedText text={incidentUpdate.message} />
          </span>
        </div>
        <div className={classes['update-item-updatedat']}>
          {getFormattedDateTime(incidentUpdate.createdAt)}
        </div>
      </div>
    )
  }

  render () {
    const { incident } = this.props
    const statusColor = getIncidentColor(incident.status)
    let incidentUpdateItems, updatedAt, detailButton
    if (incident.hasOwnProperty('incidentUpdates')) {
      incidentUpdateItems = incident.incidentUpdates.map(this.renderIncidentUpdateItem)
    } else if (this.props.autoloadDetail) {
      // now loading...
    } else {
      updatedAt = (
        <div className={classes['update-item-updatedat']}>
          {getFormattedDateTime(incident.updatedAt)}
        </div>
      )
      detailButton = (
        <i className={classnames(classes['details-icon'], 'material-icons')}
          onClick={this.handleClickDetailButton}>details</i>
      )
    }

    return (
      <li className={classnames('mdl-shadow--2dp', classes.item)}>
        <div className={classes['item-headline']}>
          <span className={classes['item-primary']}>
            <Link to={`/incidents/${this.props.incidentID}`} className={classes['item-primary-link']}
              style={{color: statusColor}}>
              {incident.status} - {incident.name}
            </Link>
            {updatedAt}
          </span>
          {detailButton}
        </div>
        {incidentUpdateItems}
      </li>
    )
  }
}
