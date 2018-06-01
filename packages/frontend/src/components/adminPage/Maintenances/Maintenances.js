import React, { PropTypes } from 'react'
import classnames from 'classnames'
import MaintenanceDialog, { maintenanceDialogType } from 'components/adminPage/MaintenanceDialog'
import MaintenanceItem from 'components/adminPage/MaintenanceItem'
import FoolproofDialog from 'components/adminPage/FoolproofDialog'
import Button from 'components/common/Button'
import ErrorMessage from 'components/common/ErrorMessage'
import { innerDialogID } from 'utils/dialog'
import classes from './Maintenances.scss'

const dialogType = {
  none: 0,
  add: 1,
  update: 2,
  delete: 3
}

export default class Maintenances extends React.Component {
  static propTypes = {
    maintenances: PropTypes.arrayOf(PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      startAt: PropTypes.string.isRequired,
      endAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired,
    fetchMaintenances: PropTypes.func.isRequired,
    deleteMaintenance: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      dialogType: dialogType.none,
      maintenanceID: null,
      isFetching: false,
      message: ''
    }
  }

  componentDidMount () {
    this.props.fetchMaintenances({
      onLoad: () => { this.setState({isFetching: true}) },
      onSuccess: () => { this.setState({isFetching: false}) },
      onFailure: (msg) => {
        this.setState({isFetching: false, message: msg})
      }
    })
  }

  handleShowDialog = (type, maintenanceID) => {
    this.setState({ maintenanceID, dialogType: type })
  }

  handleShowAddDialog = () => {
    return () => this.handleShowDialog(dialogType.add)
  }

  handleShowUpdateDialog = (maintenanceID) => {
    return () => this.handleShowDialog(dialogType.update, maintenanceID)
  }

  handleShowDeleteDialog = (maintenanceID) => {
    return () => this.handleShowDialog(dialogType.delete, maintenanceID)
  }

  handleCloseDialog = () => {
    this.setState({ maintenanceID: null, dialogType: dialogType.none })
  }

  renderDialog = () => {
    let dialog
    switch (this.state.dialogType) {
      case dialogType.none:
        dialog = null
        break
      case dialogType.add:
        dialog = <MaintenanceDialog onClosed={this.handleCloseDialog}
          dialogType={maintenanceDialogType.add} />
        break
      case dialogType.update:
        dialog = <MaintenanceDialog onClosed={this.handleCloseDialog}
          maintenanceID={this.state.maintenanceID} dialogType={maintenanceDialogType.update} />
        break
      case dialogType.delete:
        let maintenanceName
        this.props.maintenances.forEach((maintenance) => {
          if (maintenance.maintenanceID === this.state.maintenanceID) {
            maintenanceName = maintenance.name
          }
        })
        dialog = <FoolproofDialog onClosed={this.handleCloseDialog}
          name={maintenanceName} ID={this.state.maintenanceID}
          deleteFunction={this.props.deleteMaintenance} />
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }
    return dialog
  }

  render () {
    const { maintenances } = this.props
    const maintenanceItems = maintenances.map((maintenance) => {
      const id = maintenance.maintenanceID
      return (
        <MaintenanceItem key={id} onUpdateClicked={this.handleShowUpdateDialog(id)}
          onDeleteClicked={this.handleShowDeleteDialog(id)} maintenance={maintenance} />
      )
    })
    const dialog = this.renderDialog()
    const addButton = (<span><i className='material-icons'>add</i>Add</span>)

    return (
      <div className={classnames(classes.layout, 'mdl-grid')}
        style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
        <div className={classes.headline}>
          <h4>Scheduled Maintenance</h4>
          <span className={classes.showDialogButton}>
            <Button onClick={this.handleShowAddDialog()} name={addButton} class='mdl-button--accent' />
          </span>
        </div>
        <ErrorMessage message={this.state.message} />
        <ul className={classnames(classes.container, 'mdl-cell', 'mdl-cell--12-col')}>
          {maintenanceItems}
        </ul>
        <div id={innerDialogID}>
          {dialog}
        </div>
      </div>
    )
  }
}
