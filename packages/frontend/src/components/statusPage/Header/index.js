import React from 'react'
import Title from 'components/statusPage/Title'
import SubscriptionMenu from 'components/statusPage/SubscriptionMenu'
import { currTimeZone } from 'utils/datetime'
import classes from './Header.scss'

export default class Header extends React.Component {
  render () {
    return (
      <div>
        <div className={classes.top}>
          <Title />
          <SubscriptionMenu />
        </div>
        <div className={classes.timezone}>All times are in: {currTimeZone}</div>
      </div>
    )
  }
}
