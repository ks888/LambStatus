import React from 'react'

class ComponentDialog extends React.Component {
  render () {
    return (<dialog className='mdl-dialog'>
      <h4 className='mdl-dialog__title'>
        <i className='material-icons'>add</i>
        Component
      </h4>
      <div className='mdl-dialog__content'>
        Comopnent Name
      </div>
      <div className='mdl-dialog__actions'>
        <button type='button' className='mdl-button mdl-js-button mdl-button--raised mdl-button--accent' onClick={this.props.onCompleted}>Add</button>
        <button type='button' className='mdl-button mdl-js-button mdl-button--raised' onClick={this.props.onCanceled}>Cancel</button>
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
