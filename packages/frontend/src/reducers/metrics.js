import { LIST_METRICS, LIST_EXTERNAL_METRICS, ADD_METRIC, EDIT_METRIC,
         REMOVE_METRIC, LIST_METRICS_DATA } from 'actions/metrics'

function listMetricsHandler (state = { }, action) {
  const newMetrics = action.metrics
  state.metrics.forEach((metric) => {
    newMetrics.forEach((newMetric) => {
      if (newMetric.metricID === metric.metricID) newMetric.data = metric.data
    })
  })

  return Object.assign({}, state, {
    metrics: newMetrics
  })
}

function listExternalMetricsHandler (state = { }, action) {
  const fetchedMetrics = action.metrics

  const existingMetrics = (state.externalMetrics && state.externalMetrics[action.metricsType]
                           ? state.externalMetrics[action.metricsType] : [])
  const mergedMetrics = fetchedMetrics.concat(existingMetrics)
  return Object.assign({}, state, {
    externalMetrics: {
      ...state.externalMetrics,
      [action.metricsType]: mergedMetrics
    }
  })
}

function addMetricHandler (state = { }, action) {
  return Object.assign({}, state, {
    metrics: [
      ...state.metrics,
      action.metric
    ]
  })
}

function editMetricHandler (state = { }, action) {
  let editedMetric = action.metric

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
