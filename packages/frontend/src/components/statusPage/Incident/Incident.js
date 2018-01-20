import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Link from 'components/common/Link'
import ErrorMessage from 'components/common/ErrorMessage'
import Header from 'components/statusPage/Header'
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
    const { incidentID } = this.props

    let incident = ''
    if (this.props.incident) {
      incident = <IncidentItem key={incidentID} incidentID={incidentID} autoloadDetail />
    } else if (!this.state.isUpdating) {
      incident = <ErrorMessage message='The incident not found' />
    }

    return (
      <div>
        <Header />
        <div className={classes.container}>
          <h4 className={classnames(classes.title)}>Incident Report</h4>
          <ul>{incident}</ul>
        </div>
        <span className={classnames(classes.link)}><Link link='/' text='Current Incidents' /></span>
      </div>
    )
  }
}
