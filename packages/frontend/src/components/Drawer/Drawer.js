import React from 'react'
import classnames from 'classnames'
import classes from './Drawer.scss'

const components = {
  dashboard: {
    name: 'Dashboard',
    path: '/components/app_bar'
  },
  components: {
    name: 'Components',
    path: '/components/autocomplete'
  }
}

export const Drawer = ({}, { router }) => {
  const drawerItems = Object.keys(components).map((key) => {
    // const isActive = router.isActive(components[key].path)
    return (
      <a className='mdl-navigation__link' href='' onClick={() => { console.log(components[key].path) }}>
        { components[key].name }
      </a>
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
