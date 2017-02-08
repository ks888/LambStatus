import React, { PropTypes } from 'react'
import c3 from 'c3'
import 'c3/c3.css'
import classnames from 'classnames'
import ErrorMessage from 'components/ErrorMessage'
import classes from './MetricsGraph.scss'

export default class MetricsGraph extends React.Component {
  static propTypes = {
    metricID: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    }).isRequired).isRequired,
    fetchData: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      displayRange: 24,  // hours
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

    const dummydata = [
      {timestamp: '2017-02-05T00:10:44.449Z', value: 1},
      {timestamp: '2017-02-06T01:10:44.449Z', value: 2},
      {timestamp: '2017-02-07T02:10:44.449Z', value: 3},
      {timestamp: '2017-02-08T03:10:44.449Z', value: 10},
      {timestamp: '2017-02-09T04:10:44.449Z', value: 20},
      {timestamp: '2017-02-10T05:10:44.449Z', value: 30},
      {timestamp: '2017-02-11T06:10:44.449Z', value: 1},
      {timestamp: '2017-02-12T07:10:44.449Z', value: 2},
      {timestamp: '2017-02-13T08:10:44.449Z', value: 3},
      {timestamp: '2017-02-14T09:10:44.449Z', value: 100},
      {timestamp: '2017-02-15T10:10:44.449Z', value: 200},
      {timestamp: '2017-02-16T11:10:44.449Z', value: 300},
      {timestamp: '2017-02-17T12:10:44.449Z', value: 1},
      {timestamp: '2017-02-18T13:10:44.449Z', value: 2},
      {timestamp: '2017-02-19T14:10:44.449Z', value: 3},
      {timestamp: '2017-02-20T15:10:44.449Z', value: 1},
      {timestamp: '2017-02-21T16:10:44.449Z', value: 2},
      {timestamp: '2017-02-22T17:10:44.449Z', value: 3},
      {timestamp: '2017-02-23T18:10:44.449Z', value: 10},
      {timestamp: '2017-02-24T19:10:44.449Z', value: 20},
      {timestamp: '2017-02-25T20:10:44.449Z', value: 30},
      {timestamp: '2017-02-26T21:10:44.449Z', value: 1},
      {timestamp: '2017-02-27T22:10:44.449Z', value: 2},
      {timestamp: '2017-02-28T23:10:44.449Z', value: 3}
    ]

    const timestamps = dummydata.map((item) => { return item.timestamp })
    //const values = this.props.data.map((item) => { return item.value })
    const values = dummydata.map((item) => { return item.value })
    this.chart = c3.generate({
      bindto: '#' + this.props.metricID,
      size: {
        height: 200
      },
      data: {
        x: 'x',
        xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
        columns: [
          ['x', ...timestamps],
          ['data', ...values]
        ]
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: function (x) { return `${x.getMonth() + 1}/${x.getDate()}` },
            localtime: true
          }
        }
      }
    })
   }

  componentDidUpdate (prevProps, prevState) {
    if (this.chart) {
      const data = this.props.data.map((item) => { return item.value })
      this.chart.load({
        columns: [[this.props.metricID, ...data]]
      })
    }
  }

  render () {
    return (<div id={this.props.metricID} />)
  }
}
