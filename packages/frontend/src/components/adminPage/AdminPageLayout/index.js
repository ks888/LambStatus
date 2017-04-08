import React from 'react'
import classnames from 'classnames'
import Header from 'components/adminPage/Header'
import Drawer from 'components/adminPage/Drawer'
import { dialogID } from 'utils/dialog'

import classes from './AdminPageLayout.scss'

export const AdminPageLayout = ({ children }) => (
  <div className={classnames(classes.root, 'mdl-layout',
    'mdl-layout--fixed-drawer', 'mdl-layout--fixed-header')}>
    <Header />
    <Drawer />
    <main className='mdl-layout__content'>
      {children}
    </main>
    <div id={dialogID} />
  </div>
)

AdminPageLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default AdminPageLayout
