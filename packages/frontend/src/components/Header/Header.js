import React from 'react'
import AppBar from 'react-toolbox/lib/app_bar'
import {Button} from 'react-toolbox/lib/button'
import Navigation from 'react-toolbox/lib/navigation'
import classes from './Header.scss'

const actions = [
  { label: 'View Status Page', inverse: true, className: classes.naviButton }
]

export const Header = (props) => (
  <AppBar className={classes.appBar} flat fixed>
    <Button href="/" icon='inbox' label='LambStatus' inverse className={classes.title} />
    <Navigation type='horizontal' actions={actions} className={classes.navi} />
  </AppBar>
)

export default Header
