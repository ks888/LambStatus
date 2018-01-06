import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Link from 'components/common/Link'
import ErrorMessage from 'components/common/ErrorMessage'
import IncidentItem from 'components/statusPage/IncidentItem'
import classes from './Incident.scss'

export default class Incident extends React.Component {
  static propTypes = {
    incidentID: PropTypes.string.isRequired,
    incident: PropTypes.shape({
      incidentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string
    }),
    settings: PropTypes.shape({
      serviceName: PropTypes.string
    }).isRequired,
    fetchIncidents: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { isUpdating: false }
  }

  componentDidMount () {
    if (!this.props.incident) {
      this.props.fetchIncidents(this.callbacks)
    }
  }

  callbacks = {
    onLoad: () => { this.setState({isUpdating: true}) },
    onSuccess: () => { this.setState({isUpdating: false}) },
    onFailure: () => { this.setState({isUpdating: false}) }
  }

  render () {
    const { incidentID, settings } = this.props

    let incident = ''
    if (this.props.incident) {
      incident = <IncidentItem key={incidentID} incidentID={incidentID} autoloadDetail />
    } else if (!this.state.isUpdating) {
      incident = <ErrorMessage message='The incident not found' />
    }

    return (
      <div>
        <h4>Incident Report for {settings.serviceName}</h4>
        <ul className={classes.container} >
          {incident}
        </ul>
        <span className={classnames(classes.link)}><Link link='/' text='Current Incidents' /></span>
      </div>
    )
  }
}
