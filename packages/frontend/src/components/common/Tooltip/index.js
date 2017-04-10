import React from 'react'
import ReactTooltip from 'react-tooltip'
import classes from './Tooltip.scss'

export default class Tooltip extends React.Component {
  render () {
    return (<ReactTooltip effect='solid' offset={{top: -10}} className={classes.tooltip} />)
  }
}
