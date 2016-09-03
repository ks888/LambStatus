import React from 'react'
import Header from '../../components/Header'
import MainLayout from '../../components/MainLayout'
import classes from './RootLayout.scss'
import '../../styles/core.scss'

export const RootLayout = (props) => (
  <div>
    <Header className={classes.header} />
    <MainLayout className={classes.mainLayout} />
  </div>
)

RootLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default RootLayout
