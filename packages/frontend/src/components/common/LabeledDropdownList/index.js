import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Spinner from 'components/common/Spinner'
import DropdownList from 'components/common/DropdownList'
import classes from './LabeledDropdownList.scss'

export default class LabeledDropdownList extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    list: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    disabled: PropTypes.bool,
    showSpinner: PropTypes.bool,
    infoIconID: PropTypes.string
  }

  render () {
    let spinner
    if (this.props.showSpinner) {
      spinner = <Spinner enable class={classes['spinner']} />
    }

    let infoIcon
    if (this.props.infoIconID) {
      infoIcon = (
        <i
          className={classnames(classes.icon, 'material-icons')} data-tip
          data-for={this.props.infoIconID}>info_outline</i>
      )
    }

    return (
      <div>
        <label className={classes.label} htmlFor={this.props.id}>
          <div className={classes['spinner-box']}>
            {this.props.label}
            {infoIcon}
            {spinner}
          </div>
        </label>
        <div id={this.props.id} className={classes['dropdown-list']}>
          <DropdownList
            disabled={this.props.disabled} onChange={this.props.onChange}
            list={this.props.list} initialValue={this.props.initialValue} />
        </div>
      </div>
    )
  }
}
