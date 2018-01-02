import React, { PropTypes } from 'react'
import classnames from 'classnames'
import IncidentDialog, { incidentDialogType } from 'components/adminPage/IncidentDialog'
import IncidentItem from 'components/adminPage/IncidentItem'
import FoolproofDialog from 'components/adminPage/FoolproofDialog'
import Button from 'components/common/Button'
import ErrorMessage from 'components/common/ErrorMessage'
import { innerDialogID } from 'utils/dialog'
import { getIncidentColor } from 'utils/status'
import classes from './Incidents.scss'

const dialogType = {
  none: 0,
  add: 1,
  update: 2,
  delete: 3
}

export default class Incidents extends React.Component {
  static propTypes = {
    incidents: PropTypes.arrayOf(PropTypes.shape({
      incidentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired,
    fetchIncidents: PropTypes.func.isRequired,
    deleteIncident: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      dialogType: dialogType.none,
      incidentID: null,
      isFetching: false,
      message: ''
    }
  }

  componentDidMount () {
    this.props.fetchIncidents({
      onLoad: () => { this.setState({isFetching: true}) },
      onSuccess: () => { this.setState({isFetching: false}) },
      onFailure: (msg) => {
        this.setState({isFetching: false, message: msg})
      }
    })
  }

  handleShowDialog = (type, incidentID) => {
    this.setState({ incidentID, dialogType: type })
  }

  handleShowAddDialog = () => {
    return () => this.handleShowDialog(dialogType.add)
  }

  handleShowUpdateDialog = (incidentID) => {
    return () => this.handleShowDialog(dialogType.update, incidentID)
  }

  handleShowDeleteDialog = (incidentID) => {
    return () => this.handleShowDialog(dialogType.delete, incidentID)
  }

  handleCloseDialog = () => {
    this.setState({ incidentID: null, dialogType: dialogType.none })
  }

  renderDialog = () => {
    let dialog
    switch (this.state.dialogType) {
      case dialogType.none:
        dialog = null
        break
      case dialogType.add:
        dialog = <IncidentDialog onClosed={this.handleCloseDialog}
          dialogType={incidentDialogType.add} />
        break
      case dialogType.update:
        dialog = <IncidentDialog onClosed={this.handleCloseDialog}
          incidentID={this.state.incidentID} dialogType={incidentDialogType.update} />
        break
      case dialogType.delete:
        let incidentName
        this.props.incidents.forEach((incident) => {
          if (incident.incidentID === this.state.incidentID) {
            incidentName = incident.name
          }
        })
        dialog = <FoolproofDialog onClosed={this.handleCloseDialog}
          name={incidentName} ID={this.state.incidentID}
          deleteFunction={this.props.deleteIncident} />
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }
    return dialog
  }

  render () {
    const { incidents } = this.props
    const incidentItems = incidents.map((incident) => {
      return (
        <IncidentItem key={incident.incidentID} onUpdateClicked={this.handleShowUpdateDialog(incident.incidentID)}
          onDeleteClicked={this.handleShowDeleteDialog(incident.incidentID)} incident={incident}
          getIncidentColor={getIncidentColor} />
      )
    })
    const dialog = this.renderDialog()
    const textInButton = (<div>
      <i className='material-icons'>add</i>
      Incident
    </div>)

    return (
      <div className={classnames(classes.layout, 'mdl-grid')}
        style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
        <div className={classes.headline}>
          <h4>Incidents</h4>
          <span className={classes.showDialogButton}>
            <Button onClick={this.handleShowAddDialog()} name={textInButton} class='mdl-button--accent' />
          </span>
        </div>
        <ErrorMessage message={this.state.message} />
        <ul className='mdl-cell mdl-cell--12-col mdl-list'>
          {incidentItems}
        </ul>
        <div id={innerDialogID}>
          {dialog}
        </div>
      </div>
    )
  }
}
