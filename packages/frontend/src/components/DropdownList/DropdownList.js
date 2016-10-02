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
    const statusDOMs = this.props.list.map((elem) => {
      if (this.props.initialValue === elem) {
        return (<option key={elem} selected>{elem}</option>)
      } else {
        return (<option key={elem}>{elem}</option>)
      }
    })
    return (
      <span className={classnames('mdl-textfield', 'mdl-js-textfield', classes.dropdown)} ref='dropdown'>
        <select className='mdl-textfield__input' onChange={this.handleChange}>
          {statusDOMs}
        </select>
      </span>
    )
  }
}

DropdownList.propTypes = {
  onChange: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  initialValue: PropTypes.string.isRequired
}

export default DropdownList
