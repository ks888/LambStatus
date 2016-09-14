import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './ComponentDialog.scss'

class ComponentDialog extends React.Component {
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

  render () {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)}>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        <i className='material-icons'>add</i>
        COMPONENT
      </h2>
      <div className='mdl-dialog__content'>
        <div className={classnames('mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label',
          classes.dialog)} ref='textfield_name'>
          <input className='mdl-textfield__input' type='text' id='name' />
          <label className='mdl-textfield__label' htmlFor='name'>Name</label>
        </div>
        <div className={classnames('mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label',
          classes.dialog)} ref='textfield_desc'>
          <textarea className='mdl-textfield__input' type='text' rows='2' id='desc' />
          <label className='mdl-textfield__label' htmlFor='desc'>Description</label>
        </div>
      </div>
      <div className='mdl-dialog__actions'>
        <button type='button' className='mdl-button mdl-js-button mdl-button--raised
          mdl-button--accent' onClick={this.props.onCompleted} ref='button_complete'>Add</button>
        <button type='button' className='mdl-button mdl-js-button mdl-button--raised'
          onClick={this.props.onCanceled} ref='button_cancel'>Cancel</button>
      </div>
    </dialog>)
  }
}

ComponentDialog.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  description: React.PropTypes.string,
  onCompleted: React.PropTypes.func.isRequired,
  onCanceled: React.PropTypes.func.isRequired
}

ComponentDialog.defaultProps = {
  id: '',
  name: '',
  description: ''
}

export default ComponentDialog
