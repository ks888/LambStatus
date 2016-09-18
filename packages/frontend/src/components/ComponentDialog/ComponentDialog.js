import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './ComponentDialog.scss'
import Button from 'components/Button'

class ComponentDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: props.component.id,
      name: props.component.name,
      description: props.component.description,
      status: props.component.status
    }
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.handleClickDoneButton = this.handleClickDoneButton.bind(this)
  }

  componentDidMount () {
    let jsElems = [
      ReactDOM.findDOMNode(this.refs.textfield_name),
      ReactDOM.findDOMNode(this.refs.textfield_desc)
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

  handleClickDoneButton (e) {
    this.props.onCompleted(this.state.id, this.state.name, this.state.description, this.state.status)
  }

  render () {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)}>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        {this.props.actionName} Component
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
        <Button onClick={this.handleClickDoneButton} name={this.props.actionName} class='mdl-button--accent' />
        <Button onClick={this.props.onCanceled} name='Cancel' />
      </div>
    </dialog>)
  }
}

ComponentDialog.propTypes = {
  onCompleted: PropTypes.func.isRequired,
  onCanceled: PropTypes.func.isRequired,
  component: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired,
  actionName: PropTypes.string.isRequired
}

export default ComponentDialog
