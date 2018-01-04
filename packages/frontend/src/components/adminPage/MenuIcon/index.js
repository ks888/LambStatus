import React, { PropTypes } from 'react'
import classnames from 'classnames'

import Tooltip from 'components/common/Tooltip'
import classes from './MenuIcon.scss'

export default class MenuIcon extends React.Component {
  static propTypes = {
    iconName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { iconName, description, onClick } = this.props
    return (
      <span>
        <i className={classnames(classes['menu-icon'], 'material-icons')} onClick={onClick} data-tip={description}>
          {iconName}
        </i>
        <Tooltip />
      </span>
    )
  }
}
