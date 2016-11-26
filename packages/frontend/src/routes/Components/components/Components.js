import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchComponents, postComponent, updateComponent, deleteComponent, requestStatus } from '../modules/components'
import ComponentDialog from 'components/ComponentDialog'
import FoolproofDialog from 'components/FoolproofDialog'
import Button from 'components/Button'
import Snackbar from 'components/Snackbar'
import classnames from 'classnames'
import classes from './Components.scss'
import { getComponentColor } from 'utils/status'

const dialogType = {
  none: 0,
  add: 1,
  edit: 2,
  delete: 3
}

export class Components extends React.Component {
  constructor () {
    super()
    this.state = { dialogType: dialogType.none, component: null }
  }

  componentDidMount () {
    this.props.fetchComponents()
  }

  componentDidUpdate () {
    const dialog = ReactDOM.findDOMNode(this.refs.componentDialog) ||
      ReactDOM.findDOMNode(this.refs.foolproofDialog)
    if (dialog && !dialog.showModal) {
      // dialog polyfill has a limitation that the dialog should have a child of parents without parents.
      // Here is a workaround for this limitation.
      document.getElementById('dialog-container').appendChild(dialog)

      dialogPolyfill.registerDialog(dialog)
      dialog.showModal()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.updateStatus === requestStatus.inProgress &&
      nextProps.updateStatus === requestStatus.success) {
      this.handleHideDialog()
    }
  }

  handleShowDialog = (type, component) => {
    this.setState({ component: component, dialogType: type })
  }

  handleShowAddDialog = () => {
    return () => this.handleShowDialog(dialogType.add)
  }

  handleShowEditDialog = (component) => {
    return () => this.handleShowDialog(dialogType.edit, component)
  }

  handleShowDeleteDialog = (component) => {
    return () => this.handleShowDialog(dialogType.delete, component)
  }

  handleHideDialog = () => {
    const dialog = ReactDOM.findDOMNode(this.refs.componentDialog) || ReactDOM.findDOMNode(this.refs.foolproofDialog)
    if (dialog) {
      dialog.close()

      document.getElementById('inner-dialog-container').appendChild(dialog)

      this.setState({ component: null, dialogType: dialogType.none })
    }
  }

  handleAdd = (componentID, name, description, status) => {
    this.props.postComponent(name, description, status)
  }

  handleEdit = (componentID, name, description, status) => {
    this.props.updateComponent(componentID, name, description, status)
  }

  handleDelete = (componentID) => {
    this.props.deleteComponent(componentID)
  }

  renderListItem = (component) => {
    let statusColor = getComponentColor(component.status)
    return (
      <li key={component.componentID} className='mdl-list__item mdl-list__item--two-line mdl-shadow--2dp'>
        <span className='mdl-list__item-primary-content'>
          <i className={classnames(classes.icon, 'material-icons', 'mdl-list__item-avatar')}
            style={{color: statusColor}}>web</i>
          <span>{component.name}</span>
          <span className='mdl-list__item-sub-title'>{component.description}</span>
        </span>
        <span className='mdl-list__item-secondary-content'>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Edit'
                onClick={this.handleShowEditDialog(component)} />
            </div>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Delete'
                onClick={this.handleShowDeleteDialog(component)} />
            </div>
          </div>
        </span>
      </li>
    )
  }

  renderDialog = () => {
    const isUpdating = (this.props.updateStatus === requestStatus.inProgress)
    let dialog
    switch (this.state.dialogType) {
      case dialogType.none:
        dialog = null
        break
      case dialogType.add:
        let component = {
          componentID: '',
          name: '',
          description: '',
          status: 'Operational'
        }
        dialog = <ComponentDialog ref='componentDialog' onCompleted={this.handleAdd}
          onCanceled={this.handleHideDialog} isUpdating={isUpdating}
          component={component} actionName='Add' />
        break
      case dialogType.edit:
        dialog = <ComponentDialog ref='componentDialog' onCompleted={this.handleEdit}
          onCanceled={this.handleHideDialog} isUpdating={isUpdating}
          component={this.state.component} actionName='Edit' />
        break
      case dialogType.delete:
        dialog = <FoolproofDialog ref='foolproofDialog' onCompleted={this.handleDelete}
          onCanceled={this.handleHideDialog} isUpdating={isUpdating}
          name={this.state.component.name} ID={this.state.component.componentID} />
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }
    return dialog
  }

  render () {
    const { serviceComponents, loadStatus, message } = this.props
    const componentItems = serviceComponents.map(this.renderListItem)
    const dialog = this.renderDialog()
    const snackbar = <Snackbar message={message} />
    const textInButton = (<div>
      <i className='material-icons'>add</i>
      Component
    </div>)

    return (<div className={classnames(classes.layout, 'mdl-grid')} style={{ opacity: (loadStatus === requestStatus.inProgress) ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--9-col mdl-cell--middle'>
        <h4>Components</h4>
      </div>
      <div className={classnames(classes.showDialogButton, 'mdl-cell mdl-cell--3-col mdl-cell--middle')}>
        <Button onClick={this.handleShowAddDialog()} name={textInButton} class='mdl-button--accent' />
      </div>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {componentItems}
      </ul>
      <div id='inner-dialog-container'>
        {dialog}
      </div>
      {snackbar}
    </div>)
  }
}

Components.propTypes = {
  serviceComponents: PropTypes.arrayOf(PropTypes.shape({
    componentID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired).isRequired,
  loadStatus: PropTypes.number.isRequired,
  updateStatus: PropTypes.number.isRequired,
  message: PropTypes.string,
  fetchComponents: PropTypes.func.isRequired,
  postComponent: PropTypes.func.isRequired,
  updateComponent: PropTypes.func.isRequired,
  deleteComponent: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    loadStatus: state.components.loadStatus,
    updateStatus: state.components.updateStatus,
    serviceComponents: state.components.serviceComponents,
    message: state.components.message
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchComponents, postComponent, updateComponent, deleteComponent}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Components)
