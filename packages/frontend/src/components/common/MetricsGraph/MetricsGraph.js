import React, { PropTypes } from 'react'
import classnames from 'classnames'
import c3 from 'c3'
import 'c3/c3.css'
import { timeframes, getXAxisFormat, getTooltipTitleFormat, getIncrementTimestampFunc, getNumDates } from 'utils/status'
import classes from './MetricsGraph.scss'
import './MetricsGraph.global.scss'

export default class MetricsGraph extends React.Component {
  static propTypes = {
    metricID: PropTypes.string,
    metric: PropTypes.shape({
      title: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
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
      needUpdateGraph: false
    }
  }

  componentDidMount () {
    if (this.areAllDataFetched(this.props.metric.data)) {
      // The chart width is wrong if update the graph here. Let componentDidUpdate update it instead.
      this.setState({needUpdateGraph: true})
      return
    }

    if (this.props.settings.statusPageURL) {
      this.fetchMetricData()
      return
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.settings.statusPageURL && this.props.settings.statusPageURL) {
      // When componentDidMount was called, url was unknown. So fetch the data now.
      this.fetchMetricData()
      return
    }

    if (this.areAllDataFetched(this.props.metric.data)) {
      // all data were fetched. Just update the graph.
      this.updateGraph()
      return
    }

    if (prevProps.timeframe !== this.props.timeframe) {
      this.fetchMetricData()
      return
    }
  }

  fetchMetricData = () => {
    const numDates = getNumDates(this.props.timeframe)
    const currDate = new Date()
    for (let i = 0; i < numDates + 1; i++) {
      this.props.fetchData(this.props.settings.statusPageURL, this.props.metricID, currDate.getUTCFullYear(),
        currDate.getUTCMonth() + 1, currDate.getUTCDate())
      currDate.setDate(currDate.getDate() - 1)
    }
  }

  areAllDataFetched = (data) => {
    if (!data) {
      return false
    }

    let currDate = new Date()
    const numDates = getNumDates(this.props.timeframe)
    for (let i = 0; i < numDates + 1; i++) {
      const date = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`
      if (!data[date]) { return false }
      currDate.setDate(currDate.getDate() - 1)
    }
    return true
  }

  updateGraph = () => {
    const numDates = getNumDates(this.props.timeframe)
    let now = new Date()
    let currDate = new Date(now.getTime())
    const endDateStr = currDate.toISOString()
    currDate.setDate(currDate.getDate() - numDates)
    const beginDateStr = currDate.toISOString()

    const data = []
    for (let i = 0; i < numDates + 1; i++) {
      const date = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`
      if (this.props.metric.data[date]) {
        this.props.metric.data[date].forEach(dataPoint => {
          if (beginDateStr > dataPoint.timestamp || dataPoint.timestamp > endDateStr) {
            return
          }
          data.push(dataPoint)
        })
      }

      currDate.setDate(currDate.getDate() + 1)
    }
    if (data.length === 0) {
      return
    }

    const timestamps = []
    const values = []
    let minValue, maxValue
    currDate = new Date(now.getTime())
    currDate.setDate(currDate.getDate() - numDates)
    let currIndex = 0
    const incrementTimestamp = getIncrementTimestampFunc(this.props.timeframe)
    // eslint-disable-next-line no-unmodified-loop-condition
    while (currDate <= now) {
      timestamps.push(new Date(currDate.getTime()))

      const currDateStr = currDate.toISOString()
      let sum = 0
      let count = 0
      while (data[currIndex] && data[currIndex].timestamp <= currDateStr) {
        sum += data[currIndex].value
        count++
        currIndex++
      }

      if (count !== 0) {
        const avg = sum / count
        values.push(avg)
        if (minValue === undefined || minValue > avg) minValue = avg
        if (maxValue === undefined || maxValue < avg) maxValue = avg
      } else {
        values.push(null)
      }

      incrementTimestamp(currDate)
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
      bindto: '#metricID' + this.props.metricID,
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
          name: () => { return this.props.metric.title },
          value: (value) => { return Math.round(value) + this.props.metric.unit }
        }
      },
      legend: {
        show: false
      }
    })
  }

  calculateAvg = () => {
    let sum = 0
    let count = 0
    Object.keys(this.props.metric.data).forEach((key) => {
      const dataByDate = this.props.metric.data[key]
      dataByDate.forEach((entry) => {
        sum += entry.value
        count++
      })
    })

    if (count === 0) {
      return 0
    }
    return Math.round(sum / count)
  }

  hasDatapoints = () => {
    if (!this.props.metric.data) {
      return false
    }

    let currDate = new Date()
    const numDates = getNumDates(this.props.timeframe)
    for (let i = 0; i < numDates + 1; i++) {
      const date = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`
      if (this.props.metric.data[date] && this.props.metric.data[date].length !== 0) {
        return true
      }
      currDate.setDate(currDate.getDate() - 1)
    }
    return false
  }

  render () {
    let graph = (<div className={classnames(classes.loading)} >Fetching...</div>)
    let average = 0
    if (this.areAllDataFetched(this.props.metric.data)) {
      if (!this.hasDatapoints()) {
        graph = (<div className={classnames(classes.loading)} >No data for this time period yet.</div>)
      } else {
        graph = (<div id={'metricID' + this.props.metricID} />)
        average = this.calculateAvg()
      }
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
          {graph}
        </span>
      </li>
    )
  }
}
