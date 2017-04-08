import React, { PropTypes } from 'react'
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
    default: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  constructor (props) {
    super(props)
    const curr = getDateTime(this.props.default)
    const hour = curr.hour() < 10 ? `0${curr.hour()}` : `${curr.hour()}`
    const minute = curr.minute() < 10 ? `0${curr.minute()}` : `${curr.minute()}`
    this.state = {
      date: curr,
      time: `${hour}:${minute}`
    }
  }

  calcCurrentValue = (date, time) => {
    const [hour, minute] = time.split(':', 2)
    date.hour(hour)
    date.minute(minute)
    return date
  }

  handleChangeDate = (value) => {
    this.setState({date: value})
    this.props.onSelected(this.calcCurrentValue(value, this.state.time))
  }

  handleChangeTime = (value) => {
    this.setState({time: value})
    this.props.onSelected(this.calcCurrentValue(this.state.date, value))
  }

  render () {
    return (
      <div className={this.props.className}>
        <label className={classes.label} htmlFor={this.props.title}>
          {this.props.title}
        </label>
        <div className={classes.container}>
          <div className={classes.date}>
            <DatePicker dateFormat={'YYYY-MM-DD'} selected={this.state.date} onChange={this.handleChangeDate}
              className={classes.datepicker} />
          </div>
          <span className={classes.time}>
            <DropdownList onChange={this.handleChangeTime}
              list={timeCandidates} initialValue={this.state.time} />
          </span>
        </div>
      </div>
    )
  }
}
