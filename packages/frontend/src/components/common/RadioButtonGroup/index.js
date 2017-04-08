import React, { PropTypes } from 'react'
import RadioButton from 'components/common/RadioButton'
import classes from './RadioBoxGroup.scss'

export default class RadioBoxGroup extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    candidates: PropTypes.array.isRequired,
    checkedCandidate: PropTypes.string.isRequired,
    onClicked: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  render () {
    const groupName = this.props.title + ' Group'
    const radioBoxes = this.props.candidates.map((candidate) => {
      let checked = candidate === this.props.checkedCandidate
      return (
        <RadioButton key={candidate} onChange={this.props.onClicked} label={candidate}
          checked={checked} groupName={groupName} />
      )
    })

    const itemID = this.props.title
    return (
      <div className={this.props.className}>
        <label className={classes.label} htmlFor={itemID}>
          {this.props.title}
        </label>
        <div className={classes.item} id={itemID}>
          {radioBoxes}
        </div>
      </div>
    )
  }
}
