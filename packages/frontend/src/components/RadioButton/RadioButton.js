import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './RadioButton.scss'

class RadioButton extends React.Component {
  componentDidMount () {
    let jsElem = ReactDOM.findDOMNode(this.refs.radiobutton)
    componentHandler.upgradeElement(jsElem)
  }

  handleChange = (e) => {
    this.props.onChange(e.target.id)
  }

  render () {
    let inputProps = {
      type: 'radio',
      id: this.props.label,
      className: 'mdl-radio__button',
      name: 'incidentStatus',
      onChange: this.handleChange
    }
    if (this.props.checked) {
      inputProps.defaultChecked = true
    }
    let input = React.createElement('input', inputProps)
    return (
      <label className={classnames(classes.label, 'mdl-radio', 'mdl-js-radio', 'mdl-js-ripple-effect')}
        htmlFor={this.props.label} key={this.props.label} ref='radiobutton'>
        {input}
        <span className='mdl-radio__label'>{this.props.label}</span>
      </label>
    )
  }
}

RadioButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool
}

RadioButton.defaultProps = { checked: false }

export default RadioButton
