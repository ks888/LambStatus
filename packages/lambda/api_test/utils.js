const { LAMBSTATUS_TEST_API_KEY: apiKey, LAMBSTATUS_TEST_API_GATEWAY_HOSTNAME: hostname } = process.env
if (apiKey === undefined || hostname === undefined) {
  console.error('failed to load api key or hostname: ', apiKey, hostname)
}

export const headers = {'x-api-key': apiKey}
export const urlPrefix = `https://${hostname}/prod`
