import 'whatwg-fetch'
import { statusPageS3BucketURL } from 'utils/settings'
import { checkStatus, handleError } from 'utils/fetch'

export const LIST_METRICS_DATA = 'LIST_METRICS_DATA'

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
