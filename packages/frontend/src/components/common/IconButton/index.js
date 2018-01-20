import React, { PropTypes } from 'react'
import classnames from 'classnames'
import classes from './IconButton.scss'

export default class IconButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    iconName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  }

  render () {
    let onClickHandler
    let containerClass
    if (!this.props.disabled) {
      onClickHandler = this.props.onClick
      containerClass = classes['container']
    } else {
      containerClass = classnames(classes['container'], classes['disable'])
    }

    // outermost <span> is necessary to make the button region minimum
    return (
      <span>
        <span className={containerClass} onClick={onClickHandler}>
          <i className={classnames(classes['icon'], 'material-icons')} >
            {this.props.iconName}
          </i>
          {this.props.name}
        </span>
      </span>
    )
  }
}
