import React, { PropTypes } from 'react'
import c3 from 'c3'
import 'c3/c3.css'
import classnames from 'classnames'
import ErrorMessage from 'components/ErrorMessage'
import classes from './MetricsGraph.global.scss'
import { timeframes, getFormat, getCullingFunc } from 'utils/status'

export default class MetricsGraph extends React.Component {
  static propTypes = {
    metricID: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    }).isRequired).isRequired,
    dataunit: PropTypes.string.isRequired,
    timeframe: PropTypes.oneOf(timeframes).isRequired,
    fetchData: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      isFetching: false,
      message: ''
    }
  }

  componentDidMount () {
    this.props.fetchData({
      onLoad: () => { this.setState({isFetching: true}) },
      onSuccess: () => { this.setState({isFetching: false}) },
      onFailure: (msg) => {
        this.setState({isFetching: false, message: msg})
      }
    })

    this.updateGraph()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.data !== this.props.data || prevProps.timeframe !== this.props.timeframe) {
      this.updateGraph()
    }
  }

  updateGraph = () => {
    const data = this.props.data
    const timestamps = []
    const values = []
    let minValue = data[0].value
    let maxValue = data[0].value
    const cull = getCullingFunc(this.props.timeframe)
    for (let i = 0; i < data.length; i++) {
      if (minValue > data[i].value) minValue = data[i].value
      if (maxValue < data[i].value) maxValue = data[i].value

      if (cull(i)) {
        timestamps.push(data[i].timestamp)
        values.push(data[i].value)
      }
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
    const xTickFormat = getFormat(this.props.timeframe)

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
            localtime: true,
            count: 30
          },
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
          name: () => { return this.props.title },
          value: (value) => { return value + this.props.dataunit }
        }
      },
      legend: {
        show: false
      }
    })
  }

  render () {
    return (<div id={this.props.metricID} />)
  }
}
