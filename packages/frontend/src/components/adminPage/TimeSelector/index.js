import React, { PropTypes } from 'react'
import classnames from 'classnames'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DropdownList from 'components/common/DropdownList'
import { getDateTime } from 'utils/datetime'
import classes from './TimeSelector.scss'

let timeCandidates = []
const minutes = ['00', '15', '30', '45']
for (let i = 0; i < 24; i++) {
  // eslint-disable-next-line yoda
  const hour = (0 <= i && i < 10) ? `0${i}` : `${i}`
  timeCandidates = timeCandidates.concat(minutes.map(minute => { return `${hour}:${minute}` }))
}

export default class TimeSelector extends React.Component {
  static propTypes = {
    onSelected: PropTypes.func.isRequired,
    default: PropTypes.string,
    title: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  handleChangeDate = (value) => {
    this.props.onSelected()
  }

  handleChangeTime = (value) => {
    this.props.onSelected()
  }

  render () {
    let currTime, time
    if (this.props.default) {
      currTime = getDateTime(this.props.default)
      time = `${currTime.hour()}:${currTime.minute()}`
    } else {
      currTime = getDateTime(new Date().toISOString())
      time = timeCandidates[0]
    }

    console.log(this.props.className)
    return (
      <div className={this.props.className}>
        <label className={classes.label} htmlFor={this.props.title}>
          {this.props.title}
        </label>
        <div className={classes.container}>
          <div className={classes.date}>
            <DatePicker dateFormat={'YYYY-MM-DD'} selected={currTime} onChange={this.handleChangeDate}
              className={classes.datepicker} />
          </div>
          <span className={classes.time}>
            <DropdownList onChange={this.handleChangeTime}
              list={timeCandidates} initialValue={time} />
          </span>
        </div>
      </div>
    )
  }
}
