import { LIST_METRICS, LIST_EXTERNAL_METRICS, ADD_METRIC, REMOVE_METRIC, LIST_METRICS_DATA } from 'actions/metrics'

function listMetricsHandler (state = { }, action) {
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

  // TODO remove this code when the reducer which stores a list of metrics is implemented
  if (!state.hasOwnProperty(metricID)) {
    state[metricID] = {data: {}}
  }

  return Object.assign({}, state, {
    [metricID]: Object.assign({}, state[metricID], {
      data: Object.assign({}, state[metricID].data, {
        [dataKey]: metricsData
      })
    })
  })
}

const ACTION_HANDLERS = {
  [LIST_METRICS]: listMetricsHandler,
  [LIST_EXTERNAL_METRICS]: listExternalMetricsHandler,
  [ADD_METRIC]: addMetricHandler,
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
