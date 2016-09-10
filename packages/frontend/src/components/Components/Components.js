import React from 'react'

export const Components = (props) => {
  const { components, isFetching } = props
  const componentItems = Object.keys(components).map((key) => {
    return (
      <div className='mdl-cell mdl-cell--12-col'>Content</div>
    )
  })

  return (<div style={{ opacity: isFetching ? 0.5 : 1 }}>
    Components
    <div className='mdl-grid'>
      {componentItems}
    </div>
  </div>)
}

Components.propTypes = {
  components: React.PropTypes.array.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  dispatch: React.PropTypes.func.isRequired
}

export default Components
