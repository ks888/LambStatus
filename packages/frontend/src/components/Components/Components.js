import React from 'react'
import { List, ListItem } from 'react-toolbox'
import classes from './Components.scss'

export const Components = (props) => {
  const { components, isFetching } = props
  return (<div>
    <h3>Components</h3>
    <div style={{ opacity: isFetching ? 0.5 : 1 }}>
      {components.length > 0 &&
        <List className={classes.list} selectable ripple>
          <ListItem className={classes.list} caption={components} selectable onClick={() => { console.log('listitem') }}/>
        </List>
      }
    </div>
  </div>)
}

Components.propTypes = {
  components: React.PropTypes.array.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  dispatch: React.PropTypes.func.isRequired
}

export default Components
