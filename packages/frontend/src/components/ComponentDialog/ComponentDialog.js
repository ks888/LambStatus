import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './ComponentDialog.scss'

class ComponentDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      name: '',
      description: ''
    }
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.handleClickAddButton = this.handleClickAddButton.bind(this)
  }

  componentDidMount () {
    let jsElems = [
      ReactDOM.findDOMNode(this.refs.textfield_name),
      ReactDOM.findDOMNode(this.refs.textfield_desc),
      ReactDOM.findDOMNode(this.refs.button_complete),
      ReactDOM.findDOMNode(this.refs.button_cancel)
    ]
    jsElems.forEach((jsElem) => {
      componentHandler.upgradeElement(jsElem)
    })
  }

  handleChangeName (e) {
    this.setState({name: e.target.value})
  }

  handleChangeDescription (e) {
    this.setState({description: e.target.value})
  }

  handleClickAddButton (e) {
    this.props.onCompleted(this.state.id, this.state.name, this.state.description)
  }

  render () {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)}>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Add Component
      </h2>
      <div className='mdl-dialog__content'>
        <div className={classnames('mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label',
          classes.textfield)} ref='textfield_name'>
          <input className='mdl-textfield__input' type='text' id='name'
            value={this.state.name} onChange={this.handleChangeName} />
          <label className='mdl-textfield__label' htmlFor='name'>Name</label>
        </div>
        <div className={classnames('mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label',
          classes.textfield)} ref='textfield_desc'>
          <textarea className='mdl-textfield__input' type='text' rows='2' id='desc'
            value={this.state.description} onChange={this.handleChangeDescription} />
          <label className='mdl-textfield__label' htmlFor='desc'>Description</label>
        </div>
      </div>
      <div className='mdl-dialog__actions'>
        <button type='button' className='mdl-button mdl-js-button mdl-button--raised
          mdl-button--accent' onClick={this.handleClickAddButton} ref='button_complete'>Add</button>
        <button type='button' className='mdl-button mdl-js-button mdl-button--raised'
          onClick={this.props.onCanceled} ref='button_cancel'>Cancel</button>
      </div>
    </dialog>)
  }
}

ComponentDialog.propTypes = {
  onCompleted: React.PropTypes.func.isRequired,
  onCanceled: React.PropTypes.func.isRequired
}

export default ComponentDialog
