import React from 'react'
import classnames from 'classnames'
import Header from 'components/Header'
import Drawer from 'components/Drawer'
import Components from 'routes/Components/containers/ComponentsContainer'
import classes from './RootLayout.scss'

export const RootLayout = (props) => (
  <div className={classnames(classes.root, 'mdl-layout', 'mdl-js-layout',
    'mdl-layout--fixed-drawer', 'mdl-layout--fixed-header')}>
    <Header />
    <Drawer />
    <main className='mdl-layout__content'>
      <div className='page-content'>
        <Components />
      </div>
    </main>
  </div>
)

export default RootLayout
