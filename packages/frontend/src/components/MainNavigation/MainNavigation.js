import React from 'react'
import classnames from 'classnames'
import { List, ListItem } from 'react-toolbox'
import classes from './MainNavigation.scss'

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

export const MainNavigation = ({}, { router }) => {
  const drawerItems = Object.keys(components).map((key) => {
    const isActive = router.isActive(components[key].path)
    return (
      <ListItem
        key={key}
        caption={components[key].name}
        className={classnames(classes.listItem, { [classes.active]: isActive })}
        selectable
        onClick={() => { console.log(components[key].path) }}
      />
    )
  })

  return (<aside className={classes.aside}>
    <List className={classes.list} selectable ripple>
      {drawerItems}
    </List>
  </aside>)
}

MainNavigation.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default MainNavigation
