import React from 'react'
import Title from 'components/statusPage/Title'
import SubscribeButton from 'components/statusPage/SubscribeButton'
import classes from './Header.scss'

export default class Header extends React.Component {
  render () {
    return (
      <div className={classes.top}>
        <Title />
        <SubscribeButton />
      </div>
    )
  }
}
