import React from 'react'
import Header from '../../components/Header'
import MainLayout from '../../components/MainLayout'
import classes from './RootLayout.scss'

export const RootLayout = (props) => (
  <div className={classes.root}>
    <Header/>
    <MainLayout/>
  </div>
)

export default RootLayout
