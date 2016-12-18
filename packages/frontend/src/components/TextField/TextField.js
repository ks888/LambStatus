import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './TextField.scss'

class TextField extends React.Component {
  componentDidMount () {
    let jsElem = ReactDOM.findDOMNode(this.refs.textfield)
    componentHandler.upgradeElement(jsElem)
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render () {
    let textfieldType = 'text'
    if (this.props.hideText) {
      textfieldType = 'password'
    }

    let textfield
    if (!this.props.rows || this.props.rows === 1) {
      textfield = (<input className='mdl-textfield__input' type={textfieldType} id='textfield'
        value={this.props.text} onChange={this.handleChange} />)
    } else {
      textfield = (<textarea className='mdl-textfield__input' type='text' rows={this.props.rows} id='textfield'
        value={this.props.text} onChange={this.handleChange} />)
    }

    return (
      <div className={classnames('mdl-textfield', 'mdl-js-textfield',
        classes.textfield)} ref='textfield'>
        <label className={classes.label} htmlFor='textfield'>{this.props.label}</label>
        {textfield}
      </div>
    )
  }
}

TextField.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  rows: PropTypes.number,
  hideText: PropTypes.bool
}

export default TextField
