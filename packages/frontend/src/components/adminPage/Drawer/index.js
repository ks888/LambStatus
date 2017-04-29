import React from 'react'
import classnames from 'classnames'
import classes from './Drawer.scss'
import { Link } from 'react-router'

const components = {
  incidents: {
    name: 'Incidents',
    path: '/incidents'
  },
  maintenances: {
    name: 'Scheduled Maintenances',
    path: '/maintenances'
  },
  components: {
    name: 'Components',
    path: '/components'
  },
  metrics: {
    name: 'Metrics',
    path: '/metrics'
  },
  users: {
    name: 'Users',
    path: '/users'
  },
  settings: {
    name: 'Settings',
    path: '/settings'
  }
}

const Drawer = () => {
  const drawerItems = Object.keys(components).map((key) => {
    return (
      <Link key={key} to={components[key].path} className='mdl-navigation__link'
        activeClassName={classes.active} onlyActiveOnIndex>
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

export default Drawer
