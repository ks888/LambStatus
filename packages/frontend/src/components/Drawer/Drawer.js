import React from 'react'
import classnames from 'classnames'
import classes from './Drawer.scss'
import { Link } from 'react-router'

const components = {
  dashboard: {
    name: 'Dashboard',
    path: '/'
  },
  components: {
    name: 'Components',
    path: '/components'
  }
}

export const Drawer = ({}, { router }) => {
  const drawerItems = Object.keys(components).map((key) => {
    return (
      <Link key={key} to={components[key].path} className='mdl-navigation__link' activeClassName={classes.active} onlyActiveOnIndex>
        { components[key].name }
      </Link>
    )
  })

  return (<div className={classnames('mdl-layout__drawer', classes.drawer)}>
    <nav className='mdl-navigation'>
      {drawerItems}
    </nav>
  </div>)
}

Drawer.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Drawer
