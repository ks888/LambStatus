import response from 'cfn-response'
import { putObject } from 'utils/s3'
import AWS from 'aws-sdk'

export async function handler (event, context, callback) {
  if (event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }

  const params = event.ResourceProperties
  console.log(`received request (bucket name: ${params.Bucket}, key: ${params.Key})`)

  const {
    ApiKeyID,
    InvocationURL,
    Region,
    ServiceName
  } = JSON.parse(params.Body)
  try {
    const apiKey = await getApiKey(Region, ApiKeyID)
    const body = JSON.stringify({
      ApiKey: apiKey,
      InvocationURL,
      ServiceName
    })

    await putObject(Region, params.Bucket, params.Key, body)
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED, error.message)
  }
}

function getApiKey (region, apiKeyID) {
  const apiGateway = new AWS.APIGateway({ region })
  return new Promise((resolve, reject) => {
    const params = {
      apiKey: apiKeyID,
      includeValue: true
    }
    apiGateway.getApiKey(params, (error, data) => {
      if (error) {
        return reject(error)
      }
      if (!data || !data.value) {
        return reject(new Error('getApiKey returned invalid data: ' + data))
      }
      resolve(data.value)
    })
  })
}
