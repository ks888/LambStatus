import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './DropdownList.scss'

export default class DropdownList extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    initialValue: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    let jsElem = ReactDOM.findDOMNode(this.refs.dropdown)
    componentHandler.upgradeElement(jsElem)
  }

  handleChange (e) {
    this.props.onChange(e.target.value)
  }

  render () {
    const statusDOMs = this.props.list.map((elem) => {
      return (<option key={elem}>{elem}</option>)
    })
    return (
      <span ref='dropdown' className={classnames('mdl-textfield', 'mdl-js-textfield', classes.dropdown,
            (this.props.disabled ? 'is-disabled' : ''))}>
        <select className='mdl-textfield__input' onChange={this.handleChange} value={this.props.initialValue}
          disabled={this.props.disabled}>
          {statusDOMs}
        </select>
      </span>
    )
  }
}
