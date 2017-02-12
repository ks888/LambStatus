import React, { PropTypes } from 'react'
import classnames from 'classnames'
import c3 from 'c3'
import moment from 'moment-timezone'
import 'c3/c3.css'
import { timeframes, getXAxisFormat, getTooltipTitleFormat, getFlushFunc, getNumDates } from 'utils/status'
import classes from './MetricsGraph.scss'
import './MetricsGraph.global.scss'

export default class MetricsGraph extends React.Component {
  static propTypes = {
    metricID: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    metrics: PropTypes.object.isRequired,
    dataunit: PropTypes.string.isRequired,
    timeframe: PropTypes.oneOf(timeframes).isRequired,
    fetchData: PropTypes.func.isRequired
  }

  componentDidMount () {
    const numDates = getNumDates(this.props.timeframe)
    const currDate = new Date()
    currDate.setTime(currDate.getTime() + currDate.getTimezoneOffset() * 60 * 1000)  // UTC
    for (let i = 0; i < numDates + 1; i++) {
      this.props.fetchData(this.props.metricID, currDate.getFullYear(),
        currDate.getMonth() + 1, currDate.getDate())
      currDate.setDate(currDate.getDate() - 1)
    }

    if (this.props.metrics.hasOwnProperty(this.props.metricID)) {
      this.updateGraph()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!this.props.metrics.hasOwnProperty(this.props.metricID)) {
      return
    }

    if (prevProps.metrics[this.props.metricID].data !== this.props.metrics[this.props.metricID].data ||
      prevProps.timeframe !== this.props.timeframe) {
      this.updateGraph()
    }
  }

  updateGraph = () => {
    const numDates = getNumDates(this.props.timeframe)
    const currDate = new Date()
    const endDateStr = currDate.toISOString()
    currDate.setDate(currDate.getDate() - numDates)
    const beginDateStr = currDate.toISOString()

    currDate.setTime(currDate.getTime() + currDate.getTimezoneOffset() * 60 * 1000)  // UTC
    const data = []
    for (let i = 0; i < numDates + 1; i++) {
      const date = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`
      Array.prototype.push.apply(data, this.props.metrics[this.props.metricID].data[date])

      currDate.setDate(currDate.getDate() + 1)
    }

    const timestamps = []
    const values = []
    let minValue = data[data.length - 1].value
    let maxValue = minValue
    const needFlush = getFlushFunc(this.props.timeframe)
    let sum = 0
    let count = 0
    let currTimestamp
    for (let i = 0; i < data.length; i++) {
      if (beginDateStr > data[i].timestamp || data[i].timestamp > endDateStr) {
        continue
      }

      if (minValue > data[i].value) minValue = data[i].value
      if (maxValue < data[i].value) maxValue = data[i].value
      if (!currTimestamp) currTimestamp = data[i].timestamp

      if (needFlush(currTimestamp, data[i].timestamp)) {
        const timestamp = moment.tz(currTimestamp, 'UTC').tz(moment.tz.guess())
        timestamps.push(timestamp.toDate())
        values.push(sum / count)

        currTimestamp = data[i].timestamp
        sum = data[i].value
        count = 1
      } else {
        sum += data[i].value
        count++
      }
    }
    if (currTimestamp) {
      const timestamp = moment.tz(currTimestamp, 'UTC').tz(moment.tz.guess())
      timestamps.push(timestamp.toDate())
      values.push(sum / count)
    }

    const ceil = (rawValue) => {
      const value = Math.ceil(rawValue)
      const place = Math.pow(10, (value.toString().length - 1))
      return Math.ceil(value / place) * place
    }
    const floor = (rawValue) => {
      const value = Math.floor(rawValue)
      const place = Math.pow(10, (value.toString().length - 1))
      return Math.floor(value / place) * place
    }
    const ceilMaxValue = ceil(maxValue)
    const floorMinValue = floor(minValue)
    const yTicks = [floorMinValue, (ceilMaxValue + floorMinValue) / 2, ceilMaxValue]
    const xTickFormat = getXAxisFormat(this.props.timeframe)
    const tooltipTitleFormat = getTooltipTitleFormat(this.props.timeframe)

    c3.generate({
      bindto: '#' + this.props.metricID,
      size: {
        height: 120
      },
      data: {
        x: 'x',
        xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
        columns: [
          ['x', ...timestamps],
          ['data', ...values]
        ]
      },
      point: {
        show: false
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: xTickFormat,
            count: 30
          },
          localtime: true,
          padding: {
            left: 0,
            right: 0
          }
        },
        y: {
          min: floorMinValue,
          max: ceilMaxValue,
          tick: {
            values: yTicks
          },
          padding: {
            bottom: 0
          }
        }
      },
      grid: {
        y: {
          show: true
        }
      },
      tooltip: {
        format: {
          title: tooltipTitleFormat,
          name: () => { return this.props.title },
          value: (value) => { return Math.round(value) + this.props.dataunit }
        }
      },
      legend: {
        show: false
      }
    })
  }

  render () {
    if (this.props.metrics.hasOwnProperty(this.props.metricID)) {
      return (<div id={this.props.metricID} />)
    }
    return (<div className={classnames(classes.loading)} >Fetching...</div>)
  }
}
