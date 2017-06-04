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

export function listExternalMetrics (metricsType, filters, metrics) {
  return {
    type: LIST_EXTERNAL_METRICS,
    metricsType,
    filters,
    metrics
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
        headers: await buildHeaders()
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

export const fetchExternalMetrics = (metricsType, filters = {}, callbacks = {}) => {
  return async dispatch => {
    const { onLoad, onSuccess, onFailure } = callbacks
    try {
      if (onLoad && typeof onLoad === 'function') onLoad()

      let queryParam = `type=${encodeURIComponent(metricsType)}`
      if (filters) {
        queryParam += `${queryParam}&filters=${encodeURIComponent(JSON.stringify(filters))}`
      }
      let nextCursor
      let metrics = []
      while (true) {
        let url = `${apiURL}external-metrics?${queryParam}`
        if (nextCursor) {
          url += `&cursor=${encodeURIComponent(nextCursor)}`
        }
        const json = await sendRequest(url, {
          headers: await buildHeaders()
        })
        metrics = metrics.concat(json.metrics)
        dispatch(listExternalMetrics(metricsType, filters, metrics))

        if (json.nextCursor) {
          nextCursor = json.nextCursor
        } else {
          break
        }
      }
      if (onSuccess && typeof onSuccess === 'function') onSuccess()
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
      if (onFailure && typeof onFailure === 'function') onFailure(error.message)
    }
  }
}

export const postMetric = (type, props, title, status, unit, description, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { type, props, title, status, unit, description }
      const json = await sendRequest(apiURL + 'metrics', {
        headers: await buildHeaders(),
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

export const updateMetric = (metricID, type, props, title, status, unit, description, order, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { type, props, title, status, unit, description, order }
      const json = await sendRequest(apiURL + 'metrics/' + metricID, {
        headers: await buildHeaders(),
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
        headers: await buildHeaders(),
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
  let url = statusPageURL
  if (url.length > 0 && statusPageURL[statusPageURL.length - 1] === '/') {
    url = url.slice(0, url.length - 1)
  }

  return async dispatch => {
    try {
      const respBody = await sendRequest(`${url}/metrics/${metricID}/${year}/${month}/${date}.json`,
                                         {cache: 'no-cache', mode: 'cors'}, callbacks)
      if (typeof respBody === 'object') {
        dispatch(listMetricsData(metricID, year, month, date, respBody))
      }
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}
