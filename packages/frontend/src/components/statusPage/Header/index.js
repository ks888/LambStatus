import React from 'react'
import Title from 'components/statusPage/Title'
import SubscriptionMenu from 'components/statusPage/SubscriptionMenu'
import classes from './Header.scss'

export default class Header extends React.Component {
  render () {
    return (
      <div className={classes.top}>
        <Title />
        <SubscriptionMenu />
      </div>
    )
  }
}
