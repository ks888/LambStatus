import React, { PropTypes } from 'react'
import classnames from 'classnames'
import ModestLink from 'components/common/ModestLink'
import MaintenanceItem from 'components/statusPage/MaintenanceItem'
import classes from './Maintenance.scss'

export default class Maintenance extends React.Component {
  static propTypes = {
    maintenanceID: PropTypes.string.isRequired,
    maintenance: PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string,
      updatedAt: PropTypes.string.isRequired,
      startAt: PropTypes.string.isRequired,
      endAt: PropTypes.string.isRequired
    }),
    settings: PropTypes.shape({
      serviceName: PropTypes.string
    }).isRequired,
    fetchMaintenances: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (!this.props.maintenance) {
      this.props.fetchMaintenances(this.props.maintenanceID)
    }
  }

  render () {
    const { maintenanceID: id, settings } = this.props

    return (
      <div className={classnames(classes.layout, 'mdl-grid')}>
        <div className='mdl-cell mdl-cell--12-col'>
          <h4>Scheduled Maintenance Report for {settings.serviceName}</h4>
        </div>
        <div className='mdl-cell mdl-cell--12-col mdl-list'>
          {(this.props.maintenance) ? <MaintenanceItem key={id} maintenanceID={id} autoloadDetail /> : ''}
        </div>
        <ModestLink link='/' text='Current Incidents' />
      </div>
    )
  }
}
