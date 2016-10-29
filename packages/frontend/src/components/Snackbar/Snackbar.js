import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

class Snackbar extends React.Component {
  componentDidMount () {
    const node = ReactDOM.findDOMNode(this.refs.snackbar)
    componentHandler.upgradeElement(node)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.message !== this.props.message && nextProps.message !== ''
  }

  componentDidUpdate () {
    const node = ReactDOM.findDOMNode(this.refs.snackbar)
    const data = { message: this.props.message }
    node.MaterialSnackbar.showSnackbar(data)
  }

  render () {
    return (
      <div className='mdl-js-snackbar mdl-snackbar' ref='snackbar'>
        <div className='mdl-snackbar__text' />
        <button className='mdl-snackbar__action' type='button' />
      </div>
    )
  }
}

Snackbar.propTypes = {
  message: PropTypes.string
}

Snackbar.defaultProps = { message: '' }

export default Snackbar
