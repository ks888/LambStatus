import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { fetchComponents, postComponent, updateComponent } from '../modules/components'
import ComponentDialog from 'components/ComponentDialog'
import classnames from 'classnames'
import classes from './ComponentsContainer.scss'
import { getColor } from 'utils/colors'

class Components extends React.Component {
  constructor () {
    super()
    this.state = { showDialog: false }
    this.handleShowDialog = this.handleShowDialog.bind(this)
    this.handleAddComponent = this.handleAddComponent.bind(this)
    this.handleCancelDialog = this.handleCancelDialog.bind(this)
  }

  componentDidMount () {
    let jsElem = ReactDOM.findDOMNode(this.refs.add_component_button)
    componentHandler.upgradeElement(jsElem)

    this.props.dispatch(fetchComponents)
  }

  componentDidUpdate () {
    let dialog = ReactDOM.findDOMNode(this.refs.componentDialog)
    if (dialog) {
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog)
      }
      try {
        dialog.showModal()

        // workaround https://github.com/GoogleChrome/dialog-polyfill/issues/105
        let overlay = document.querySelector('._dialog_overlay')
        if (overlay) {
          overlay.parentNode.removeChild(overlay)
        }
      } catch (ex) {
        console.warn('Failed to show dialog')
      }
    }
  }

  handleShowDialog () {
    this.setState({ showDialog: true })
  }

  handleAddComponent (id, name, description, status) {
    if (id) {
      this.props.dispatch(updateComponent(id, name, description, status))
    } else {
      this.props.dispatch(postComponent(name, description, status))
    }
    this.handleCancelDialog()
  }

  handleCancelDialog () {
    let dialog = ReactDOM.findDOMNode(this.refs.componentDialog)
    dialog.close()
    this.setState({ showDialog: false })
  }

  render () {
    const { serviceComponents, isFetching } = this.props
    const componentItems = serviceComponents.map((component) => {
      let statusColor = getColor(component.status)
      return (
        <li key={component.id} className='mdl-list__item mdl-list__item--two-line mdl-shadow--2dp'>
          <span className='mdl-list__item-primary-content'>
            <i className={classnames(classes.icon, 'material-icons', 'mdl-list__item-avatar')} style={{color: statusColor}}>web</i>
            <span>{component.name}</span>
            <span className='mdl-list__item-sub-title'>{component.description}</span>
          </span>
          <span className='mdl-list__item-secondary-content'>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--6-col'>
                <button className='mdl-button mdl-js-button'>
                  Edit
                </button>
              </div>
              <div className='mdl-cell mdl-cell--6-col'>
                <button className='mdl-button mdl-js-button'>
                  Delete
                </button>
              </div>
            </div>
          </span>
        </li>
      )
    })

    let dialog
    if (this.state.showDialog) {
      dialog = <ComponentDialog ref='componentDialog' onCompleted={this.handleAddComponent}
        onCanceled={this.handleCancelDialog} />
    }

    return (<div className={classnames(classes.layout, 'mdl-grid')} style={{ opacity: isFetching ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--9-col mdl-cell--middle'>
        <h4>Components</h4>
      </div>
      <div className={classnames(classes.showDialogButton, 'mdl-cell mdl-cell--3-col mdl-cell--middle')}>
        <button className='mdl-button mdl-js-button mdl-button--raised mdl-button--accent'
          onClick={this.handleShowDialog} ref='add_component_button'>
          <i className='material-icons'>add</i>
          Component
        </button>
      </div>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {componentItems}
      </ul>
      {dialog}
    </div>)
  }
}

Components.propTypes = {
  serviceComponents: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired).isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.components.isFetching,
    serviceComponents: state.components.serviceComponents
  }
}

export default connect(mapStateToProps)(Components)
