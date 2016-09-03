import React from 'react'
import AppBar from 'react-toolbox/lib/app_bar'
import Link from 'react-toolbox/lib/link'
import Navigation from 'react-toolbox/lib/navigation';
import classes from './Header.scss'

const actions = [
  { icon: 'cake', label: 'A piece of cake!'},
  { icon: 'room', label: 'My room'}
]

export const Header = (props) => (
  <AppBar>
    <Link active href="/" label="LambStatus"/>
    <Navigation type='horizontal' actions={actions} />
  </AppBar>
)

export default Header
