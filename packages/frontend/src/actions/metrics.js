import 'whatwg-fetch'
import { sendRequest, buildHeaders } from 'utils/fetch'
import { apiURL } from 'utils/settings'

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
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + 'metrics', {
        headers: buildHeaders()
      }, callbacks)
      dispatch(listMetrics(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const fetchPublicMetrics = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + 'public-metrics', {}, callbacks)
      dispatch(listMetrics(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const fetchExternalMetrics = (metricsType, callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + 'external-metrics?type=' + metricsType, {
        headers: buildHeaders()
      }, callbacks)
      dispatch(listExternalMetrics(metricsType, json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const postMetric = (type, props, title, status, unit, description, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { type, props, title, status, unit, description }
      const json = await sendRequest(apiURL + 'metrics', {
        headers: buildHeaders(),
        method: 'POST',
        body: JSON.stringify(body)
      }, callbacks)
      dispatch(addMetric(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const updateMetric = (metricID, type, props, title, status, unit, description, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { type, props, title, status, unit, description }
      const json = await sendRequest(apiURL + 'metrics/' + metricID, {
        headers: buildHeaders(),
        method: 'PATCH',
        body: JSON.stringify(body)
      }, callbacks)
      dispatch(editMetric(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const deleteMetric = (metricID, callbacks = {}) => {
  return async dispatch => {
    try {
      await sendRequest(apiURL + 'metrics/' + metricID, {
        headers: buildHeaders(),
        method: 'DELETE'
      }, callbacks)
      dispatch(removeMetric(metricID))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const fetchMetricsData = (statusPageURL, metricID, year, month, date, callbacks = {}) => {
  return async dispatch => {
    try {
      const respBody = await sendRequest(`${statusPageURL}/metrics/${metricID}/${year}/${month}/${date}.json`,
                                         {cache: 'no-cache'}, callbacks)
      if (typeof respBody === 'object') {
        dispatch(listMetricsData(metricID, year, month, date, respBody))
      }
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}
