import React, { PropTypes } from 'react'
import classnames from 'classnames'
import DropdownList from 'components/common/DropdownList'
import { componentStatuses } from 'utils/status'
import classes from './ComponentStatusSelector.scss'

export default class ComponentStatusSelector extends React.Component {
  static propTypes = {
    onSelected: PropTypes.func.isRequired,
    component: PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    const { component } = this.props
    return (
      <div id='components' className={classnames('mdl-grid', classes.components)} key={component.componentID}>
        <span className={classnames('mdl-cell', 'mdl-cell--6-col', 'mdl-cell--middle', classes.component_name)}>
          {component.name}
        </span>
        <span className={classnames('mdl-cell', 'mdl-cell--6-col', 'mdl-cell--middle', classes.component_dropdown)}>
          <DropdownList onChange={this.props.onSelected} list={componentStatuses} initialValue={component.status} />
        </span>
      </div>
    )
  }
}
