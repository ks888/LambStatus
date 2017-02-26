import { LIST_METRICS, LIST_PUBLIC_METRICS, LIST_EXTERNAL_METRICS, ADD_METRIC, EDIT_METRIC,
         REMOVE_METRIC, LIST_METRICS_DATA } from 'actions/metrics'

function listMetricsHandler (state = { }, action) {
  return Object.assign({}, state, {
    metrics: JSON.parse(action.metrics)
  })
}

function listPublicMetricsHandler (state = { }, action) {
  return Object.assign({}, state, {
    metrics: JSON.parse(action.metrics)
  })
}

function listExternalMetricsHandler (state = { }, action) {
  return Object.assign({}, state, {
    externalMetrics: {
      [action.metricsType]: JSON.parse(action.metrics),
      ...state.externalMetrics
    }
  })
}

function addMetricHandler (state = { }, action) {
  return Object.assign({}, state, {
    metrics: [
      ...state.metrics,
      JSON.parse(action.metric)
    ]
  })
}

function editMetricHandler (state = { }, action) {
  let editedMetric = JSON.parse(action.metric)

  const newMetrics = state.metrics.map((metric) => {
    if (metric.metricID === editedMetric.metricID) {
      return Object.assign({}, metric, editedMetric)
    }
    return metric
  })

  newMetrics.sort((a, b) => a.order - b.order)

  return Object.assign({}, state, {
    metrics: newMetrics
  })
}

function removeMetricHandler (state = { }, action) {
  let metrics = state.metrics.filter((metric) => {
    return metric.metricID !== action.metricID
  })

  return Object.assign({}, state, {
    metrics
  })
}

function listMetricsDataHandler (state = { }, action) {
  const {
    metricID,
    year,
    month,
    date,
    metricsData
  } = action
  const dataKey = `${year}-${month}-${date}`

  const newMetrics = state.metrics.map((metric) => {
    if (metric.metricID === metricID) {
      const newMetricsData = Object.assign({}, metric.data, {
        [dataKey]: metricsData
      })
      return Object.assign({}, metric, {data: newMetricsData})
    }
    return metric
  })

  return Object.assign({}, state, {
    metrics: newMetrics
  })
}

const ACTION_HANDLERS = {
  [LIST_METRICS]: listMetricsHandler,
  [LIST_PUBLIC_METRICS]: listPublicMetricsHandler,
  [LIST_EXTERNAL_METRICS]: listExternalMetricsHandler,
  [ADD_METRIC]: addMetricHandler,
  [EDIT_METRIC]: editMetricHandler,
  [REMOVE_METRIC]: removeMetricHandler,
  [LIST_METRICS_DATA]: listMetricsDataHandler
}

export default function metricsReducer (state = {
  metrics: [],
  externalMetrics: {}
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
