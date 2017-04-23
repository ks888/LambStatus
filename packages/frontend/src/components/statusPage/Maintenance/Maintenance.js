import React, { PropTypes } from 'react'
import classnames from 'classnames'
import ModestLink from 'components/common/ModestLink'
import MaintenanceItem from 'components/statusPage/MaintenanceItem'
import { serviceName } from 'utils/settings'
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
    fetchMaintenances: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (!this.props.maintenance) {
      this.props.fetchMaintenances(this.props.maintenanceID)
    }
  }

  render () {
    const { maintenanceID } = this.props

    return (
      <div className={classnames(classes.layout, 'mdl-grid')}>
        <div className='mdl-cell mdl-cell--12-col'>
          <h4>Scheduled Maintenance Report for {serviceName}</h4>
        </div>
        <div className='mdl-cell mdl-cell--12-col mdl-list'>
          {(this.props.maintenance) ? <MaintenanceItem key={maintenanceID} maintenanceID={maintenanceID} autoloadDetail /> : ''}
        </div>
        <ModestLink link='/' text='Current Incidents' />
      </div>
    )
  }
}
