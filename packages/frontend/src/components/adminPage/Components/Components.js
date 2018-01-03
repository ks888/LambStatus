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

  constructor () {
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
      const params = Object.assign({}, clickedComp, {order: newOrder})
      this.props.updateComponent(params, this.callbacks)
    }
  }

  renderListItem = (component, i) => {
    let statusColor = getComponentColor(component.status)
    return (
      <li key={component.componentID} className={classnames(classes.item, 'mdl-shadow--2dp')}>
        <div className={classes['primary-content']}>
          <i className={classnames(classes.icon, 'material-icons')}
            style={{color: statusColor}} data-tip={component.status}>web</i>
          <Tooltip />
          <div>
            <div>{component.name}</div>
            <div className={classes.subtitle}>{component.description}</div>
          </div>
        </div>
        <div className={classes['secondary-content']}>
          <i className={classnames(classes['menu-icon'], 'material-icons')} onClick={this.handleShowEditDialog(component)}>
            edit
          </i>
          <i className={classnames(classes['menu-icon'], 'material-icons')} onClick={this.handleShowDeleteDialog(component)}>
            delete
          </i>
          <i className={classnames(classes['menu-icon'], 'material-icons')} onClick={this.handleClickArrowUpward(i)}>
            arrow_upward
          </i>
          <i className={classnames(classes['menu-icon'], 'material-icons')}
            onClick={this.handleClickArrowDownward(i)}>
            arrow_downward
          </i>
        </div>
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
    const addButton = (<span><i className='material-icons'>add</i>Add</span>)

    return (
      <div className={classnames(classes.layout, 'mdl-grid')}
        style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
        <div className={classes.headline}>
          <h4>Components</h4>
          <span className={classes.showDialogButton}>
            <Button onClick={this.handleShowAddDialog()} name={addButton} class='mdl-button--accent' />
          </span>
        </div>
        <ErrorMessage message={this.state.message} />
        <ul className={classnames(classes.container, 'mdl-cell', 'mdl-cell--12-col')}>
          {componentItems}
        </ul>
        <div id={innerDialogID}>
          {dialog}
        </div>
      </div>
    )
  }
}
