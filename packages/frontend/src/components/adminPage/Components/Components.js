import React, { PropTypes } from 'react'
import classnames from 'classnames'
import ComponentDialog, { componentDialogType } from 'components/adminPage/ComponentDialog'
import FoolproofDialog from 'components/adminPage/FoolproofDialog'
import Button from 'components/common/Button'
import Tooltip from 'components/common/Tooltip'
import ErrorMessage from 'components/common/ErrorMessage'
import { getComponentColor } from 'utils/status'
import { innerDialogID } from 'utils/dialog'
import classes from './Components.scss'

const dialogType = {
  none: 0,
  add: 1,
  edit: 2,
  delete: 3
}

export default class Components extends React.Component {
  static propTypes = {
    components: PropTypes.arrayOf(PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired
    }).isRequired).isRequired,
    fetchComponents: PropTypes.func.isRequired,
    updateComponent: PropTypes.func.isRequired,
    deleteComponent: PropTypes.func.isRequired
  }

  constructor (props) {
    super()
    this.state = {
      dialogType: dialogType.none,
      component: null,
      isFetching: false,
      message: ''
    }
  }

  callbacks = {
    onLoad: () => { this.setState({isFetching: true}) },
    onSuccess: () => { this.setState({isFetching: false}) },
    onFailure: (msg) => {
      this.setState({isFetching: false, message: msg})
    }
  }

  componentDidMount () {
    this.props.fetchComponents(this.callbacks)
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

  handleCloseDialog = () => {
    this.setState({ component: null, dialogType: dialogType.none })
  }

  handleClickArrowUpward = (i) => {
    if (i === 0) { return () => {} }
    return this.handleClickArrowDownward(i - 1)
  }

  handleClickArrowDownward = (i) => {
    return () => {
      if (i === this.props.components.length - 1) { return }
      const { components } = this.props
      const clickedComp = components[i]
      const orderA = components[i + 1].order
      const orderB = (i + 2 < components.length ? components[i + 2].order : Math.floor(new Date().getTime() / 1000))
      const newOrder = Math.floor((orderA + orderB) / 2)
      this.props.updateComponent(clickedComp.componentID, clickedComp.name, clickedComp.description,
                                 clickedComp.status, newOrder, this.callbacks)
    }
  }

  renderListItem = (component, i) => {
    let statusColor = getComponentColor(component.status)
    return (
      <li key={component.componentID} className='mdl-list__item mdl-list__item--two-line mdl-shadow--2dp'>
        <span className='mdl-list__item-primary-content'>
          <i className={classnames(classes.icon, 'material-icons', 'mdl-list__item-avatar')}
            style={{color: statusColor}} data-tip={component.status}>web</i>
          <Tooltip />
          <span>{component.name}</span>
          <span className='mdl-list__item-sub-title'>{component.description}</span>
        </span>
        <span className={classnames('mdl-list__item-secondary-content', classes['buttons'])}>
          <Button plain name='Edit' onClick={this.handleShowEditDialog(component)} />
          <Button plain name='Delete' onClick={this.handleShowDeleteDialog(component)} />
          <div className={classnames(classes['order-buttons'])}>
            <i className={classnames(classes['order-icon'], 'material-icons')} onClick={this.handleClickArrowUpward(i)}>
              arrow_upward
            </i>
            <i className={classnames(classes['order-icon'], 'material-icons')}
              onClick={this.handleClickArrowDownward(i)}>
              arrow_downward
            </i>
          </div>
        </span>
      </li>
    )
  }

  renderDialog = () => {
    let dialog
    switch (this.state.dialogType) {
      case dialogType.none:
        dialog = null
        break
      case dialogType.add:
        dialog = <ComponentDialog onClosed={this.handleCloseDialog}
          dialogType={componentDialogType.add} />
        break
      case dialogType.edit:
        dialog = <ComponentDialog onClosed={this.handleCloseDialog}
          component={this.state.component} dialogType={componentDialogType.edit} />
        break
      case dialogType.delete:
        dialog = <FoolproofDialog onClosed={this.handleCloseDialog}
          name={this.state.component.name} ID={this.state.component.componentID}
          deleteFunction={this.props.deleteComponent} />
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }
    return dialog
  }

  render () {
    const componentItems = this.props.components.map(this.renderListItem)

    const dialog = this.renderDialog()
    const textInButton = (<div>
      <i className='material-icons'>add</i>
      Component
    </div>)

    return (<div className={classnames(classes.layout, 'mdl-grid')}
      style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--9-col mdl-cell--middle'>
        <h4>Components</h4>
      </div>
      <div className={classnames(classes.showDialogButton, 'mdl-cell mdl-cell--3-col mdl-cell--middle')}>
        <Button onClick={this.handleShowAddDialog()} name={textInButton} class='mdl-button--accent' />
      </div>
      <div className='mdl-cell mdl-cell--12-col mdl-list'>
        <ErrorMessage message={this.state.message} />
      </div>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {componentItems}
      </ul>
      <div id={innerDialogID}>
        {dialog}
      </div>
    </div>)
  }
}
