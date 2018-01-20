import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { maintenanceStatuses } from 'utils/status'
import MaintenanceItem from 'components/statusPage/MaintenanceItem'
import classes from './ScheduledMaintenances.scss'

export default class ScheduledMaintenaces extends React.Component {
  static propTypes = {
    maintenances: PropTypes.arrayOf(PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired,
    classNames: PropTypes.string,
    fetchMaintenances: PropTypes.func.isRequired
  }

  // Do not load maintenances here, expecting Incidents component does it.
  // componentDidMount () {
  //   this.props.fetchMaintenances()
  // }

  render () {
    const { maintenances } = this.props
    if (!maintenances) {
      return null
    }
    const filteredMaintenances = maintenances.filter(maint => {
      return maint.status !== maintenanceStatuses[maintenanceStatuses.length - 1]
    })
    if (filteredMaintenances.length === 0) {
      return null
    }

    return (
      <div className={classes.container}>
        <h4 className={classnames(classes.title)}>Scheduled Maintenance</h4>
        <ul>
          {filteredMaintenances.map(maint => {
            return (
              <MaintenanceItem key={maint.maintenanceID} maintenanceID={maint.maintenanceID} autoloadDetail />
            )
          })}
        </ul>
      </div>
    )
  }
}
