import React, { PropTypes } from 'react'
import { getComponentColor } from 'utils/status'

export default class Components extends React.Component {
  static propTypes = {
    components: PropTypes.arrayOf(PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }).isRequired).isRequired,
    classNames: PropTypes.string,
    fetchComponents: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchComponents(this.fetchCallbacks)
  }

  render () {
    const components = this.props.components.map(component => {
      let statusColor = getComponentColor(component.status)
      return (
        <li key={component.componentID} className='mdl-list__item mdl-list__item--two-line mdl-shadow--2dp'>
          <span className='mdl-list__item-primary-content'>
            <span>{component.name}</span>
            <span className='mdl-list__item-sub-title'>{component.description}</span>
          </span>
          <span className='mdl-list__item-secondary-content' style={{color: statusColor}}>
            {component.status}
          </span>
        </li>
      )
    })

    return (
      <ul className={this.props.classNames}>
        {components}
      </ul>
    )
  }
}
