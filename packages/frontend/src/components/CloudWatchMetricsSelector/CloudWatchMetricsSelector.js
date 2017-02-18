import React, { PropTypes } from 'react'
import classnames from 'classnames'
import DropdownList from 'components/DropdownList'
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
    this.state = {
      message: ''
    }
  }

  componentDidMount () {
    const fetchCallbacks = {
      onFailure: (msg) => {
        this.setState({message: msg})
      }
    }
    this.props.fetchExternalMetrics('CloudWatch', fetchCallbacks)
  }

  handleChangeNamespace = (value) => {
    this.props.onChange({
      Namespace: value
    })
  }

  handleChangeMetric = (value) => {
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
    this.props.onChange({
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

  render () {
    let namespaces = []
    const metrics = []
    if (this.props.metrics) {
      const namespaceSet = new Set([''])
      this.props.metrics.forEach((metric) => {
        namespaceSet.add(metric.Namespace)
      })
      namespaces = Array.from(namespaceSet).sort()

      if (this.props.props && this.props.props.Namespace) {
        this.props.metrics.forEach((metric) => {
          if (metric.Namespace === this.props.props.Namespace) {
            metrics.push(this.buildMetricExpression(metric))
          }
        })
      }
      metrics.sort()
    }

    let initialNamespace = ''
    let initialMetric = ''
    if (this.props.props) {
      const props = this.props.props
      initialNamespace = props.Namespace
      if (props.Dimensions) {
        initialMetric = this.buildMetricExpression(props)
      }
    }

    return (
      <div>
        <label className={classes.label} htmlFor='metric'>
          CloudWatch Namespace
        </label>
        <div id='metric' className={classes['dropdown-list']}>
          <DropdownList onChange={this.handleChangeNamespace}
            list={namespaces} initialValue={initialNamespace} />
        </div>
        <label className={classes.label} htmlFor='metric'>
          CloudWatch MetricName & Dimensions
        </label>
        <div id='metric' className={classes['dropdown-list']}>
          <DropdownList onChange={this.handleChangeMetric}
            list={metrics} initialValue={initialMetric} />
        </div>
      </div>
    )
  }
}
