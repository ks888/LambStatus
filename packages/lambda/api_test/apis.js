import fetch from 'node-fetch'
import { componentStatuses, incidentStatuses } from 'utils/const'

const { LAMBSTATUS_TEST_API_KEY: apiKey, LAMBSTATUS_TEST_API_GATEWAY_HOSTNAME: hostname } = process.env
if (apiKey === undefined || hostname === undefined) {
  console.error('failed to load api key or hostname: ', apiKey, hostname)
}

const headers = {'x-api-key': apiKey}
const urlPrefix = `https://${hostname}/prod`

export const v0GetComponents = async () => {
  const url = `${urlPrefix}/api/v0/components`
  const response = await fetch(url, {headers})
  const body = await response.json()
  return {response, body}
}

export const v0PostComponents = async ({name = 'C1', description = '', status = componentStatuses[0]} = {}) => {
  const url = `${urlPrefix}/api/v0/components`
  const reqbody = {name, description, status}
  const response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(reqbody)})
  const body = await response.json()
  return {response, body}
}

export const v0PatchComponents = async (componentID, component) => {
  const url = `${urlPrefix}/api/v0/components/${componentID}`
  const response = await fetch(url, {method: 'PATCH', headers, body: JSON.stringify(component)})
  const body = await response.json()
  return {response, body}
}

export const v0DeleteComponent = async (componentID) => {
  const url = `${urlPrefix}/api/v0/components/${componentID}`
  const response = await fetch(url, {method: 'DELETE', headers})
  return {response}
}

export const v0GetIncidents = async () => {
  const url = `${urlPrefix}/api/v0/incidents`
  const response = await fetch(url, {headers})
  const body = await response.json()
  return {response, body}
}

export const v0PostIncidents = async ({name = 'I1', status = incidentStatuses[0], message = '',
                                       components = []} = {}) => {
  const url = `${urlPrefix}/api/v0/incidents`
  const reqbody = {name, status, message, components}
  const response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(reqbody)})
  const body = await response.json()
  return {response, body}
}

export const v0GetIncident = async (incidentID) => {
  const url = `${urlPrefix}/api/v0/incidents/${incidentID}`
  const response = await fetch(url, {headers})
  const body = await response.json()
  return {response, body}
}

export const v0PatchIncidents = async (incidentID, incident) => {
  const url = `${urlPrefix}/api/v0/incidents/${incidentID}`
  const response = await fetch(url, {method: 'PATCH', headers, body: JSON.stringify(incident)})
  const body = await response.json()
  return {response, body}
}

export const v0DeleteIncident = async (incidentID) => {
  const url = `${urlPrefix}/api/v0/incidents/${incidentID}`
  const response = await fetch(url, {method: 'DELETE', headers})
  return {response}
}

export const v0GetIncidentUpdates = async (incidentID) => {
  const url = `${urlPrefix}/api/v0/incidents/${incidentID}/incidentupdates`
  const response = await fetch(url, {headers})
  const body = await response.json()
  return {response, body}
}

export const v0PatchIncidentUpdate = async (incidentID, incidentUpdateID, incidentUpdate) => {
  const url = `${urlPrefix}/api/v0/incidents/${incidentID}/incidentupdates/${incidentUpdateID}`
  const response = await fetch(url, {method: 'PATCH', headers, body: JSON.stringify(incidentUpdate)})
  const body = await response.json()
  return {response, body}
}
