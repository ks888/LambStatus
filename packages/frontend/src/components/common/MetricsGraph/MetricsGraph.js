import React, { PropTypes } from 'react'
import classnames from 'classnames'
import c3 from 'c3'
import 'c3/c3.css'
import { timeframes, getXAxisFormat, getTooltipTitleFormat, getIncrementTimestampFunc, getNumDates } from 'utils/status'
import classes from './MetricsGraph.scss'
import './MetricsGraph.global.scss'

export class GraphDrawer {
  constructor (nodeID) {
    this.nodeID = nodeID
    this.graph = null
    this.average = null
  }

  ceil = (rawValue) => {
    const value = Math.ceil(rawValue)
    const place = Math.pow(10, (value.toString().length - 1))
    return Math.ceil(value / place) * place
  }

  floor = (rawValue) => {
    const value = Math.floor(rawValue)
    const place = Math.pow(10, (value.toString().length - 1))
    return Math.floor(value / place) * place
  }

  cutDecimalPart = (rawValue, decimalPlaces = 0) => {
    const mul = Math.pow(10, decimalPlaces)
    return Math.floor(rawValue * mul) / mul
  }

  formatNumber = (rawValue, decimalPlaces = 0) => {
    const value = this.cutDecimalPart(rawValue, decimalPlaces)

    let [integerPart, decimalPart = ''] = value.toString().split('.', 2)
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    decimalPart = decimalPart + '0'.repeat(decimalPlaces - decimalPart.length)

    if (decimalPlaces === 0) return `${integerPart}`
    return `${integerPart}.${decimalPart}`
  }

  collectDataWithinRange = (metric, dates, beginDate, endDate) => {
    const data = []
    dates.forEach(date => {
      if (!metric.data[date]) {
        return
      }

      metric.data[date].forEach(dataPoint => {
        if (beginDate > dataPoint.timestamp || dataPoint.timestamp > endDate) {
          return
        }
        data.push(dataPoint)
      })
    })
    return data
  }

  calculateAverage = (data) => {
    let sum = 0
    let count = 0
    data.forEach(entry => {
      sum += entry.value
      count++
    })

    if (count === 0) {
      return 0
    }
    return sum / count
  }

  // startDate and endDate will not be changed.
  averageDataByInterval = (data, startDate, endDate, incrementTimestamp) => {
    const timestamps = []
    const values = []
    let currIndex = 0
    let currDate = new Date(startDate.getTime())
    let currDateStr = currDate.toISOString()
    while (data[currIndex] && data[currIndex].timestamp < currDateStr) {
      currIndex++
    }

    while (currDate <= endDate) {
      timestamps.push(new Date(currDate.getTime()))
      incrementTimestamp(currDate)
      if (currDate > endDate) {
        currDate = new Date(endDate.getTime() + 1)  // +1 to avoid inf loop
      }

      currDateStr = currDate.toISOString()
      let sum = 0
      let count = 0
      while (data[currIndex] && data[currIndex].timestamp < currDateStr) {
        sum += data[currIndex].value
        count++
        currIndex++
      }

      if (count !== 0) {
        values.push(sum / count)
      } else {
        values.push(null)
      }
    }

    return { timestamps, values }
  }

  draw = (metric, timeframe) => {
    const numDates = getNumDates(timeframe)
    let now = new Date()
    let currDate = new Date(now.getTime())
    const endDateStr = currDate.toISOString()
    currDate.setDate(currDate.getDate() - numDates)
    const beginDateStr = currDate.toISOString()

    const dates = []
    for (let i = 0; i < numDates + 1; i++) {
      const date = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`
      dates.push(date)
      currDate.setDate(currDate.getDate() + 1)
    }

    const data = this.collectDataWithinRange(metric, dates, beginDateStr, endDateStr)
    if (data.length === 0) {
      this.clear()
      return false
    }

    currDate = new Date(now.getTime())
    currDate.setDate(currDate.getDate() - numDates)
    const incrementTimestamp = getIncrementTimestampFunc(timeframe)
    const { timestamps, values } = this.averageDataByInterval(data, currDate, now, incrementTimestamp)

    const minValue = values.reduce((min, curr) => (min === undefined || min > curr) ? curr : min, undefined)
    const maxValue = values.reduce((max, curr) => (max === undefined || max < curr) ? curr : max, undefined)
    const ceiledMaxValue = this.ceil(maxValue)
    const flooredMinValue = this.floor(minValue)

    const yTicks = [flooredMinValue, (ceiledMaxValue + flooredMinValue) / 2, ceiledMaxValue]
    const xTickFormat = getXAxisFormat(timeframe)
    const tooltipTitleFormat = getTooltipTitleFormat(timeframe)

    this.graph = c3.generate({
      bindto: `#${this.nodeID}`,
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
        show: true,
        r: 1,
        focus: {
          expand: {
            r: 2.5
          }
        }
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
          min: flooredMinValue,
          max: ceiledMaxValue,
          tick: {
            format: this.formatNumber,
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
          name: () => { return metric.title },
          value: value => this.formatNumber(value, metric.decimalPlaces) + metric.unit
        }
      },
      legend: {
        show: false
      }
    })

    this.average = this.formatNumber(this.calculateAverage(data), metric.decimalPlaces)

    return true
  }

  clear = () => {
    if (this.graph !== null) {
      this.graph = this.graph.destroy()
    }
    this.average = null
  }
}

export const graphStatus = {
  preparing: 1,
  ready: 2,
  failed: 3
}

export default class MetricsGraph extends React.Component {
  static propTypes = {
    metricID: PropTypes.string.isRequired,
    metric: PropTypes.shape({
      title: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
      decimalPlaces: PropTypes.number.isRequired,
      data: PropTypes.object
    }),
    settings: PropTypes.shape({
      statusPageURL: PropTypes.string
    }).isRequired,
    timeframe: PropTypes.oneOf(timeframes).isRequired,
    fetchData: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      status: graphStatus.preparing
    }
    this.graphNodeID = `metricID${props.metricID}`
    this.graphDrawer = new GraphDrawer(this.graphNodeID)
  }

  componentDidMount () {
    if (this.areAllDataFetched(this.props.metric.data, this.props.timeframe)) {
      this.draw(this.props.metric, this.props.timeframe)
      return
    }

    if (this.props.settings.statusPageURL) {
      this.fetchMetricData(this.props.settings.statusPageURL, this.props.timeframe)
      return
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.settings.statusPageURL && nextProps.settings.statusPageURL) {
      // When componentDidMount was called, url was unknown. So fetch the data now.
      this.fetchMetricData(nextProps.settings.statusPageURL, nextProps.timeframe)
      return
    }

    if (this.areAllDataFetched(nextProps.metric.data, nextProps.timeframe)) {
      this.draw(nextProps.metric, nextProps.timeframe)
      return
    }

    if (this.props.timeframe !== nextProps.timeframe) {
      this.graphDrawer.clear()
      this.setState({status: graphStatus.preparing})
      this.fetchMetricData(nextProps.settings.statusPageURL, nextProps.timeframe)
      return
    }
  }

  draw = (metric, timeframe) => {
    const ok = this.graphDrawer.draw(metric, timeframe)
    if (ok) {
      this.setState({status: graphStatus.ready})
    } else {
      this.setState({status: graphStatus.failed})
    }
  }

  fetchMetricData = (url, timeframe) => {
    const numDates = getNumDates(timeframe)
    const currDate = new Date()
    for (let i = 0; i < numDates + 1; i++) {
      this.props.fetchData(url, this.props.metricID, currDate.getUTCFullYear(), currDate.getUTCMonth() + 1,
                           currDate.getUTCDate())
      currDate.setDate(currDate.getDate() - 1)
    }
  }

  areAllDataFetched = (data, timeframe) => {
    if (!data) {
      return false
    }

    let currDate = new Date()
    const numDates = getNumDates(timeframe)
    for (let i = 0; i < numDates + 1; i++) {
      const date = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`
      if (!data[date]) { return false }
      currDate.setDate(currDate.getDate() - 1)
    }
    return true
  }

  render () {
    let message
    let average = 0
    switch (this.state.status) {
      case graphStatus.preparing:
        message = (<div className={classnames(classes.loading)} >Fetching...</div>)
        break
      case graphStatus.ready:
        message = null
        average = this.graphDrawer.average
        break
      case graphStatus.failed:
        message = (<div className={classnames(classes.loading)} >No data for this time period yet.</div>)
        break
      default:
        throw new Error('Unknown status', this.graphDrawer.status)
    }

    return (
      <li key={this.props.metricID} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.item_primary)}>
          <div className={classnames(classes.title)}>
            {this.props.metric.title}
            <span className={classnames(classes.average)}>
              {`${average}${this.props.metric.unit}`}
            </span>
          </div>
          {message}
          <div id={this.graphNodeID} />
        </span>
      </li>
    )
  }
}
