import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './RadioButton.scss'

class RadioButton extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    let jsElem = ReactDOM.findDOMNode(this.refs.radiobutton)
    componentHandler.upgradeElement(jsElem)
  }

  handleChange (e) {
    this.props.onChange(e.target.value)
  }

  render () {
    return (
      <label className='mdl-radio mdl-js-radio mdl-js-ripple-effect' htmlFor={this.props.label}
        key={this.props.label} ref='radiobutton'>
        <input type='radio' id={this.props.label} className='mdl-radio__button' name='incidentStatus'
          value={this.props.label} onChange={this.handleChange} />
        <span className='mdl-radio__label'>{this.props.label}</span>
      </label>
    )
  }
}

RadioButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
}

export default RadioButton
