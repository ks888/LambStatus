import { MetricsStoreProxy } from 'api/utils'
import 'plugins/monitoringServices'  // load monitoring services
import https from 'https'

const dummyAPICall = () => {
  return new Promise((resolve, reject) => {
    https.get('https://jnd0u85j8h.execute-api.us-west-2.amazonaws.com/prod/api/components', (resp) => {
      let body = ''
      resp.on('data', (d) => {
        body += d
      })
      resp.on('end', () => {
        resolve(body)
      })
    }).on('error', (e) => {
      reject(e.message)
    })
  })
}

export async function handle (event, context, callback) {
  // Continuously access API Gateway to generate demo data.
  await dummyAPICall()

  try {
    let metrics = await new MetricsStoreProxy().query()
    await Promise.all(metrics
                      .filter(metric => !metric.monitoringService.shouldAdminPostDatapoints())
                      .map(async metric => await metric.collect()))
    callback(null)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to collect metrics data')
  }
}
