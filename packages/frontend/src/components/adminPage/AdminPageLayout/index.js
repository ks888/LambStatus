import React from 'react'
import Header from 'components/adminPage/Header'
import Drawer from 'components/adminPage/Drawer'
import { dialogID } from 'utils/dialog'

import classes from './AdminPageLayout.scss'

export const AdminPageLayout = ({ children }) => (
  <div className={classes.root}>
    <Header />
    <Drawer />
    <main className={classes.content}>
      {children}
    </main>
    <div id={dialogID} />
  </div>
)

AdminPageLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default AdminPageLayout
