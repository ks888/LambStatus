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
        <div key={component.ID} className='mdl-cell mdl-cell--12-col mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <p>{component.name}</p>
            <p>{component.status}</p>
            <p>{component.description}</p>
          </div>
        </div>
      )
    })

    return (<div className='mdl-grid' style={{ opacity: isFetching ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--12-col'>
        <h4>Components</h4>
      </div>
      {componentItems}
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
  console.log(state.components.serviceComponents)
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
