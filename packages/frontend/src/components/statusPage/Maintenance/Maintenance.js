import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Link from 'components/common/Link'
import ErrorMessage from 'components/common/ErrorMessage'
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

  constructor (props) {
    super(props)
    this.state = { isUpdating: false }
  }

  componentDidMount () {
    if (!this.props.maintenance) {
      this.props.fetchMaintenances(this.callbacks)
    }
  }

  callbacks = {
    onLoad: () => { this.setState({isUpdating: true}) },
    onSuccess: () => { this.setState({isUpdating: false}) },
    onFailure: () => { this.setState({isUpdating: false}) }
  }

  render () {
    const { maintenanceID: id, settings } = this.props

    let maintenance = ''
    if (this.props.maintenance) {
      maintenance = <MaintenanceItem key={id} maintenanceID={id} autoloadDetail />
    } else if (!this.state.isUpdating) {
      maintenance = <ErrorMessage message='The scheduled maintenance not found' />
    }

    return (
      <div>
        <h4>Scheduled Maintenance Report for {settings.serviceName}</h4>
        <ul className={classes.container} >
          {maintenance}
        </ul>
        <span className={classnames(classes.link)}><Link link='/' text='Current Incidents' /></span>
      </div>
    )
  }
}
