import React, { PropTypes } from 'react'
import classnames from 'classnames'

import Button from 'components/common/Button'
import MetricsGraph from 'components/common/MetricsGraph'
import { timeframes } from 'utils/status'
import classes from './Metrics.scss'

export default class Metrics extends React.Component {
  static propTypes = {
    metrics: PropTypes.arrayOf(PropTypes.shape({
      metricID: PropTypes.string.isRequired
    }).isRequired).isRequired,
    fetchPublicMetrics: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      timeframe: timeframes[0]
    }
  }

  componentDidMount () {
    this.props.fetchPublicMetrics()
  }

  renderMetrics = (metric) => {
    return <MetricsGraph key={metric.metricID} metricID={metric.metricID} timeframe={this.state.timeframe} />
  }

  clickHandler = (timeframe) => {
    return () => { this.setState({timeframe}) }
  }

  renderTimeframeSelector = () => {
    let candidates = []
    for (let i = 0; i < timeframes.length; i++) {
      let text = timeframes[i]
      if (timeframes[i] === this.state.timeframe) {
        text = <span className={classes['timeframe-checked']}>{timeframes[i]}</span>
      }
      const candidate = (
        <Button plain name={text} class={(i === 0 ? classes['timeframe-left'] : classes.timeframe)}
          key={timeframes[i]} onClick={this.clickHandler(timeframes[i])} />
      )
      candidates.push(candidate)
    }
    return candidates
  }

  render () {
    if (this.props.metrics.length === 0) {
      return null
    }

    const timeframeSelector = this.renderTimeframeSelector()
    return (
      <div className={classes.container}>
        <h4 className={classnames(classes.title)}>
          Metrics<span className={classnames(classes.timeframes)}>{timeframeSelector}</span>
        </h4>
        <ul>
          {this.props.metrics.map(this.renderMetrics)}
        </ul>
      </div>
    )
  }
}
