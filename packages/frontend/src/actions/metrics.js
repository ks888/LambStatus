import 'whatwg-fetch'
import { apiURL, statusPageS3BucketURL } from 'utils/settings'
import { checkStatus, handleError, buildHeaders } from 'utils/fetch'

export const LIST_METRICS = 'LIST_METRICS'
export const LIST_METRICS_DATA = 'LIST_METRICS_DATA'
export const REMOVE_METRIC = 'REMOVE_METRIC'

export function listMetrics (json) {
  return {
    type: LIST_METRICS,
    metrics: json
  }
}

export function listMetricsData (metricID, year, month, date, metricsData) {
  return {
    type: LIST_METRICS_DATA,
    metricID,
    year,
    month,
    date,
    metricsData
  }
}

export function removeMetric (metricID) {
  return {
    type: REMOVE_METRIC,
    metricID
  }
}

export const fetchMetrics = (callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'metrics')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(listMetrics(json))
      })
      .catch(handleError(onFailure))
  }
}

export const deleteMetric = (metricID, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'metrics/' + metricID, {
      headers: buildHeaders(),
      method: 'DELETE'
    }).then(checkStatus)
      .then(response => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(removeMetric(metricID))
      })
      .catch(handleError(onFailure))
  }
}

export const fetchMetricsData = (metricID, year, month, date, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(`${statusPageS3BucketURL}/metrics/${metricID}/${year}/${month}/${date}.json`)
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(listMetricsData(metricID, year, month, date, json))
      })
      .catch(handleError(onFailure))
  }
}
