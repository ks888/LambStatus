import React from 'react'
import classnames from 'classnames'
import classes from './StatusPageLayout.scss'

export const StatusPageLayout = ({ children }) => (
  <div className={classnames(classes.root, 'mdl-layout', 'mdl-js-layout',
    'mdl-layout--fixed-drawer', 'mdl-layout--fixed-header')}>
    <main className='mdl-layout__content'>
      {children}
    </main>
  </div>
)

StatusPageLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default StatusPageLayout
