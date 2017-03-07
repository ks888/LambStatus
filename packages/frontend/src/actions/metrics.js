import 'whatwg-fetch'
import { apiURL, statusPageURL } from 'utils/settings'
import { checkStatus, handleError, buildHeaders } from 'utils/fetch'

export const LIST_METRICS = 'LIST_METRICS'
export const LIST_EXTERNAL_METRICS = 'LIST_EXTERNAL_METRICS'
export const LIST_METRICS_DATA = 'LIST_METRICS_DATA'
export const ADD_METRIC = 'ADD_METRIC'
export const EDIT_METRIC = 'EDIT_METRIC'
export const REMOVE_METRIC = 'REMOVE_METRIC'

export function listMetrics (json) {
  return {
    type: LIST_METRICS,
    metrics: json
  }
}

export function listExternalMetrics (metricsType, json) {
  return {
    type: LIST_EXTERNAL_METRICS,
    metricsType,
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

export function addMetric (json) {
  return {
    type: ADD_METRIC,
    metric: json
  }
}

export function editMetric (json) {
  return {
    type: EDIT_METRIC,
    metric: json
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
    return fetch(apiURL + 'metrics', {
      headers: buildHeaders()
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(listMetrics(json))
      })
      .catch(handleError(onFailure))
  }
}

export const fetchPublicMetrics = (callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'public-metrics')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(listMetrics(json))
      })
      .catch(handleError(onFailure))
  }
}

export const fetchExternalMetrics = (metricsType, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'external-metrics?type=' + metricsType, {
      headers: buildHeaders()
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(listExternalMetrics(metricsType, json))
      })
      .catch(handleError(onFailure))
  }
}

export const postMetric = (type, props, title, status, unit, description, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    let body = { type, props, title, status, unit, description }
    return fetch(apiURL + 'metrics', {
      headers: buildHeaders(),
      method: 'POST',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(addMetric(json))
      })
      .catch(handleError(onFailure))
  }
}

export const updateMetric = (metricID, type, props, title, status, unit, description, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    let body = { type, props, title, status, unit, description }
    return fetch(apiURL + 'metrics/' + metricID, {
      headers: buildHeaders(),
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(editMetric(json))
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
    return fetch(`${statusPageURL}/metrics/${metricID}/${year}/${month}/${date}.json`,
                {cache: 'no-cache'})
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(listMetricsData(metricID, year, month, date, json))
      })
      .catch(handleError(onFailure))
  }
}
