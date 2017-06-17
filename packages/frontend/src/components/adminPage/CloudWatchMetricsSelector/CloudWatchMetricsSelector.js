import React, { PropTypes } from 'react'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'
import DropdownList from 'components/common/DropdownList'
import Spinner from 'components/common/Spinner'
import { apiURL } from 'utils/settings'
import { regions, cloudWatchMonitoringService } from 'utils/status'
import classes from './CloudWatchMetricsSelector.scss'

export default class CloudWatchMetricsSelector extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    filters: PropTypes.object,
    metrics: PropTypes.arrayOf(PropTypes.object.isRequired),
    props: PropTypes.object,
    fetchExternalMetrics: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    const matched = apiURL.match(/execute-api.([a-z0-9-]+).amazonaws.com/)
    if (matched && matched.length === 2) {
      this.region = matched[1]
    } else {
      console.error('failed to get region from', apiURL)
    }

    this.regionNames = regions.map(r => r.name)

    const region = (props.props && props.props.Region) ? props.props.Region : this.region
    const regionName = regions.find(r => r.id === region).name
    const namespace = props.props ? props.props.Namespace : ''
    const metric = props.props ? this.buildMetricExpression(props.props) : ''
    this.state = {
      regionName,
      namespace,
      metric,
      isFetching: false
    }
  }

  callbacks = {
    onLoad: () => { this.setState({isFetching: true}) },
    onSuccess: () => { this.setState({isFetching: false}) },
    onFailure: () => {
      this.setState({isFetching: false})
    }
  }

  componentDidMount () {
    if (this.needFetching()) {
      const regionID = regions.find(r => r.name === this.state.regionName).id
      this.props.fetchExternalMetrics(cloudWatchMonitoringService, {region: regionID}, this.callbacks)
    }
  }

  needFetching = () => {
    if (!this.props.metrics || !this.props.filters) { return true }

    const regionOfCurrentMetrics = regions.find(r => r.id === this.props.filters.region)
    return regionOfCurrentMetrics.name !== this.state.regionName
  }

  handleChangeRegion = (value) => {
    this.setState({regionName: value, namespace: '', metric: ''})

    const regionID = regions.find(r => r.name === value).id
    this.props.fetchExternalMetrics(cloudWatchMonitoringService, {region: regionID}, this.callbacks)
  }

  handleChangeNamespace = (value) => {
    this.setState({namespace: value, metric: ''})
  }

  handleChangeMetric = (value) => {
    this.setState({metric: value})

    const { metricName, dimensions } = this.parseMetricExpression(value)
    const regionID = regions.find(r => r.name === this.state.regionName).id
    this.props.onChange({
      Region: regionID,
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
    if (!this.needFetching()) {
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

    const linkToMetricsPage = `https://${this.region}.console.aws.amazon.com/cloudwatch/home?region=${this.region}#metricsV2:`
    let spinner
    if (this.state.isFetching) {
      spinner = <Spinner enable class={classes['spinner']} />
    }

    return (
      <div>
        <label className={classes.label} htmlFor='region'>
          CloudWatch Region
          <i className={classnames(classes.icon, 'material-icons')}
            data-tip data-for='cloudWatchInfo'>info_outline</i>
        </label>
        <div id='region' className={classes['dropdown-list']}>
          <DropdownList disabled={this.state.isFetching} onChange={this.handleChangeRegion}
            list={this.regionNames} initialValue={this.state.regionName} />
        </div>

        <label className={classes.label} htmlFor='namespace'>
          <div className={classes['spinner-box']}>
            CloudWatch Namespace
            {spinner}
          </div>
        </label>
        <div id='namespace' className={classes['dropdown-list']}>
          <DropdownList disabled={this.state.isFetching} onChange={this.handleChangeNamespace}
            list={namespaces} initialValue={this.state.namespace} />
        </div>

        <label className={classes.label} htmlFor='name'>
          <div className={classes['spinner-box']}>
            CloudWatch MetricName & Dimensions
            {spinner}
          </div>
        </label>
        <div id='name' className={classes['dropdown-list']}>
          <DropdownList disabled={this.state.isFetching} onChange={this.handleChangeMetric}
            list={metrics} initialValue={this.state.metric} />
        </div>

        <ReactTooltip id='cloudWatchInfo' effect='solid' place='right' delayHide={5000} className={classes.tooltip}>
          <div>
            Access
            <a href={linkToMetricsPage} className={classes.link} target='_blank'>
              the CloudWatch Management Console
            </a>
            to check graphs.
          </div>
        </ReactTooltip>
      </div>
    )
  }
}
