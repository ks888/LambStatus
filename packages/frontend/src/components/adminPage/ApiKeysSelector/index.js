import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { getDateTimeFormat } from 'utils/datetime'
import classes from './ApiKeysSelector.scss'

export const apiKeyStatuses = {
  toBeCreated: 0,
  created: 1,
  toBeDeleted: 2
}

export default class ApiKeysSelector extends React.Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    apiKeys: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string,
      createdDate: PropTypes.string,
      status: PropTypes.number.isRequired
    })).isRequired
  }

  handleClickText = (e) => {
    e.target.select()
  }

  handleClickDeleteIcon = (id) => {
    return () => { this.props.onDelete(id) }
  }

  renderApiKey = (apiKey) => {
    let input, createdAt
    switch (apiKey.status) {
      case apiKeyStatuses.toBeCreated:
        const msg = 'New key will be created when the SAVE button is pressed.'
        input = (
          <input className={classnames(classes['key-not-created'], 'mdl-textfield__input')} value={msg} readOnly />
        )
        break
      case apiKeyStatuses.created:
        input = (
          <input className={classnames(classes['key-created'], 'mdl-textfield__input')}
            onClick={this.handleClickText} value={apiKey.value} readOnly />
        )
        createdAt = (
          <span className={classes['created-at']}>
            Created at {getDateTimeFormat(apiKey.createdDate, 'MMM DD, YYYY - HH:mm')}
          </span>
        )
        break
      case apiKeyStatuses.toBeDeleted:
        const deleteMsg = 'This key will be deleted when the SAVE button is pressed.'
        input = (
          <input className={classnames(classes['key-not-created'], 'mdl-textfield__input')} value={deleteMsg}
            readOnly />
        )
        break
      default:
        throw new Error('unknown status', apiKey.status)
    }

    return (
      <div className={classes.item} key={apiKey.id}>
        {input}
        {createdAt}
        <i className={classnames(classes['delete-icon'], 'material-icons')}
          onClick={this.handleClickDeleteIcon(apiKey.id)}>delete</i>
      </div>
    )
  }

  render () {
    const apiKeys = this.props.apiKeys.map(this.renderApiKey)
    return (
      <div className={classnames(classes.container)}>
        <label className={classes.label}>API Keys</label>
        {apiKeys}
        <i className={classnames(classes['add-icon'], 'material-icons')} onClick={this.props.onAdd}>
          add_circle_outline
        </i>
      </div>
    )
  }
}
