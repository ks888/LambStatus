import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Button from 'components/common/Button'
import AutolinkedText from 'components/common/AutolinkedText'
import { getIncidentColor } from 'utils/status'
import { getDateTimeFormat } from 'utils/datetime'
import classes from './IncidentItem.scss'

export default class IncidentItem extends React.Component {
  static propTypes = {
    onDetailClicked: PropTypes.func,
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
    showDetailButton: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      showDetailButton: props.showDetailButton
    }
  }

  handleClickDetailButton = () => {
    this.setState({showDetailButton: false})
    this.props.onDetailClicked(this.props.incident.incidentID)
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
          {getDateTimeFormat(incidentUpdate.updatedAt)}
        </div>
      </div>
    )
  }

  render () {
    const { incident } = this.props
    const statusColor = getIncidentColor(incident.status)
    let incidentUpdateItems
    if (incident.hasOwnProperty('incidentUpdates')) {
      incidentUpdateItems = incident.incidentUpdates.map(this.renderIncidentUpdateItem)
    }
    let updatedAt, detailButton
    if (this.state.showDetailButton) {
      updatedAt = (
        <span className='mdl-list__item-sub-title'>
          {getDateTimeFormat(incident.updatedAt)}
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
          <span className={classnames('mdl-list__item-primary-content', classes.item_primary)}
            style={{color: statusColor}}>
            {incident.status} - {incident.name}
            {updatedAt}
          </span>
          {detailButton}
        </div>
        {incidentUpdateItems}
      </li>
    )
  }
}
