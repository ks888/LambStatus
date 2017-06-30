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
      incidentUpdates: PropTypes.arrayOf(PropTypes.shape({
        incidentUpdateID: PropTypes.string.isRequired,
        incidentStatus: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
      }).isRequired)
    }).isRequired,
    autoloadDetail: PropTypes.bool,
    fetchIncidentUpdates: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (this.props.autoloadDetail) {
      this.props.fetchIncidentUpdates(this.props.incident.incidentID)
    }
  }

  handleClickDetailButton = () => {
    this.props.fetchIncidentUpdates(this.props.incident.incidentID)
  }

  renderIncidentUpdateItem = (incidentUpdate) => {
    return (
      <div className={classnames(classes.inner_item)} key={incidentUpdate.incidentUpdateID}>
        <div>
          {incidentUpdate.incidentStatus}
          <span className={classnames(classes.inner_item_message)}> - <AutolinkedText text={incidentUpdate.message} />
          </span>
        </div>
        <div className={classnames(classes.inner_item_updatedat)}>
          {getFormattedDateTime(incidentUpdate.updatedAt)}
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
        <span className='mdl-list__item-sub-title'>
          {getFormattedDateTime(incident.updatedAt)}
        </span>
      )
      detailButton = (
        <span className='mdl-list__item-secondary-content'>
          <Button plain name='Detail' onClick={this.handleClickDetailButton} />
        </span>
      )
    }

    return (
      <li className={classnames('mdl-list__item', 'mdl-list__item--two-line', 'mdl-shadow--4dp', classes.item)}>
        <div className={classes.item_headline}>
          <span className={classnames('mdl-list__item-primary-content', classes.item_primary)}>
            <Link to={`/incidents/${this.props.incidentID}`} className={classes.item_primary_link}
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
