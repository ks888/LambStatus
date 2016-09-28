import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './DropdownList.scss'

class DropdownList extends React.Component {
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
    const statusDOMs = this.props.list.map((status) => {
      return (<option>{status}</option>)
    })
    return (
      <div className='mdl-textfield mdl-js-textfield' ref='dropdown'>
        <select className='mdl-textfield__input'>
          {statusDOMs}
        </select>
      </div>
    )
  }
}

DropdownList.propTypes = {
  onChange: PropTypes.func.isRequired,
  list: PropTypes.string.isRequired
}

export default DropdownList
