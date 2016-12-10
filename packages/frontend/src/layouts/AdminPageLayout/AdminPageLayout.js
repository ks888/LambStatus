import React from 'react'
import classnames from 'classnames'
import Header from 'containers/Header'
import Drawer from 'components/Drawer'
import classes from './AdminPageLayout.scss'

export const AdminPageLayout = ({ children }) => (
  <div className={classnames(classes.root, 'mdl-layout', 'mdl-js-layout',
    'mdl-layout--fixed-drawer', 'mdl-layout--fixed-header')}>
    <Header />
    <Drawer />
    <main className='mdl-layout__content'>
      {children}
    </main>
    <div id='dialog-container' />
  </div>
)

AdminPageLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default AdminPageLayout
