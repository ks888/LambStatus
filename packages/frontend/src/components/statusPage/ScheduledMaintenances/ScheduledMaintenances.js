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
      updatedAt: PropTypes.string.isRequired,
      maintenanceUpdates: PropTypes.arrayOf(PropTypes.shape({
        maintenanceUpdateID: PropTypes.string.isRequired,
        maintenanceStatus: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
      }).isRequired)
    }).isRequired).isRequired,
    classNames: PropTypes.string,
    fetchMaintenances: PropTypes.func.isRequired,
    fetchMaintenanceUpdates: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      needDetail: false
    }
  }

  componentDidMount () {
    this.props.fetchMaintenances({
      onSuccess: () => { this.setState({needDetail: true}) }
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.needDetail) {
      nextProps.maintenances.forEach((maintenance) => {
        this.props.fetchMaintenanceUpdates(maintenance.maintenanceID, this.fetchCallbacks)
      })
      this.setState({needDetail: false})
    }
  }

  render () {
    const { maintenances } = this.props
    if (!maintenances) {
      return null
    }
    const filteredMaintenances = maintenances.filter(maint => {
      return maint.maintenanceUpdates && maint.status !== maintenanceStatuses[maintenanceStatuses.length - 1]
    })
    if (filteredMaintenances.length === 0) {
      return null
    }

    return (
      <ul className={this.props.classNames}>
        <h4 className={classnames(classes.title)}>Scheduled Maintenances</h4>
        {filteredMaintenances.map(maint => {
          return (
            <MaintenanceItem key={maint.maintenanceID} maintenance={maint} showDetailButton={false} />
          )
        })}
      </ul>
    )
  }
}
