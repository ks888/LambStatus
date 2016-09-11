import React from 'react'
import { connect } from 'react-redux'
import { fetchComponents } from '../modules/components'

class Components extends React.Component {
  componentDidMount () {
    this.props.dispatch(fetchComponents)
  }

  render () {
    const { serviceComponents, isFetching } = this.props
    const componentItems = serviceComponents.map((component) => {
      return (
        <li key={component.ID} className='mdl-list__item mdl-list__item--two-line mdl-shadow--2dp'>
          <span className='mdl-list__item-primary-content'>
            <i className='material-icons mdl-list__item-avatar'>web</i>
            <span>{component.name}</span>
            <span className='mdl-list__item-sub-title'>{component.description}</span>
          </span>
          <span className='mdl-list__item-secondary-content'>
            {component.status}
          </span>
        </li>
      )
    })

    return (<div className='mdl-grid' style={{ opacity: isFetching ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--10-col mdl-cell--middle'>
        <h4>Components</h4>
      </div>
      <div className='mdl-cell mdl-cell--2-col mdl-cell--middle'>
        <button className='mdl-button mdl-js-button mdl-button--raised mdl-button--accent'>
          <i className='material-icons'>add</i>
          Component
        </button>
      </div>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {componentItems}
      </ul>
    </div>)
  }
}

Components.propTypes = {
  serviceComponents: React.PropTypes.array.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  dispatch: React.PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  let serviceComponents
  if (Array.isArray(state.components.serviceComponents)) {
    serviceComponents = []
  } else {
    serviceComponents = JSON.parse(state.components.serviceComponents)
  }
  return {
    isFetching: state.components.isFetching || false,
    serviceComponents: serviceComponents
  }
}

export default connect(mapStateToProps)(Components)
