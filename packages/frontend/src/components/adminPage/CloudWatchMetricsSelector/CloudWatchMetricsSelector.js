import React, { PropTypes } from 'react'
import DropdownList from 'components/common/DropdownList'
import classes from './CloudWatchMetricsSelector.scss'

export default class CloudWatchMetricsSelector extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    metrics: PropTypes.arrayOf(PropTypes.object.isRequired),
    props: PropTypes.object,
    fetchExternalMetrics: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    let namespace = props.props ? props.props.Namespace : ''
    let metric = props.props ? this.buildMetricExpression(props.props) : ''
    this.state = {
      namespace,
      metric
    }
  }

  componentDidMount () {
    this.props.fetchExternalMetrics('CloudWatch')
  }

  handleChangeNamespace = (value) => {
    this.setState({namespace: value})
  }

  handleChangeMetric = (value) => {
    this.setState({metric: value})

    const { metricName, dimensions } = this.parseMetricExpression(value)
    this.props.onChange({
      Namespace: this.state.namespace,
      MetricName: metricName,
      Dimensions: dimensions
    })
  }

  buildMetricExpression = (metric) => {
    const dimensions = metric.Dimensions.map((dim) => {
      return `${dim.Name}: ${dim.Value}`
    })
    return `${metric.MetricName} - [${dimensions.join(', ')}]`
  }

  parseMetricExpression = (value) => {
    const splitStr = ' - ['
    const splitIndex = value.indexOf(splitStr)
    const metricName = value.substr(0, splitIndex)

    const rawDims = value.slice(splitIndex + splitStr.length, -1)
    const dimensions = rawDims.split(', ').map((rawDim) => {
      const splitStr = ': '
      const splitIndex = rawDim.indexOf(splitStr)
      const dimName = rawDim.substr(0, splitIndex)
      const dimValue = rawDim.substr(splitIndex + splitStr.length)
      return {Name: dimName, Value: dimValue}
    })

    return { metricName, dimensions }
  }

  render () {
    let namespaces = ['']
    let metrics = ['']
    if (this.props.metrics) {
      const namespaceSet = new Set()
      this.props.metrics.forEach((metric) => {
        namespaceSet.add(metric.Namespace)
      })
      namespaces = namespaces.concat(Array.from(namespaceSet).sort())

      this.props.metrics.forEach((metric) => {
        if (metric.Namespace === this.state.namespace) {
          metrics.push(this.buildMetricExpression(metric))
        }
      })
      metrics.sort()
    } else {
      namespaces = [this.state.namespace]
      metrics = [this.state.metric]
    }

    return (
      <div>
        <label className={classes.label} htmlFor='metric'>
          CloudWatch Namespace
        </label>
        <div id='metric' className={classes['dropdown-list']}>
          <DropdownList onChange={this.handleChangeNamespace}
            list={namespaces} initialValue={this.state.namespace} />
        </div>
        <label className={classes.label} htmlFor='metric'>
          CloudWatch MetricName & Dimensions
        </label>
        <div id='metric' className={classes['dropdown-list']}>
          <DropdownList onChange={this.handleChangeMetric}
            list={metrics} initialValue={this.state.metric} />
        </div>
      </div>
    )
  }
}
