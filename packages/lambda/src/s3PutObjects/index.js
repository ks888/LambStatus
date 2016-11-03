import response from 'cfn-response'
import { putObject } from 'utils/s3'
import AWS from 'aws-sdk'

export async function handler (event, context, callback) {
  if (event.RequestType !== 'Create') {
    response.send(event, context, response.SUCCESS)
    return
  }

  const params = event.ResourceProperties
  console.log(`received request (bucket name: ${params.Bucket}, key: ${params.Key})`)

  const {
    ApiKeyID,
    InvocationURL,
    Region
  } = JSON.parse(params.Body)
  try {
    const apiKey = await getApiKey(Region, ApiKeyID)
    const body = JSON.stringify({
      ApiKey: apiKey,
      InvocationURL: InvocationURL
    })
    console.log(body)

    await putObject(Region, params.Bucket, params.Key, body)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
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

/*
{ "RequestType": "Create", "ServiceToken": "arn:aws:lambda:ap-northeast-1:702451219851:function:StatusPage20161103-02-S3PutObjectFunction-MN753E9LC1C0", "ResponseURL": "https://cloudformation-custom-resource-response-apnortheast1.s3-ap-northeast-1.amazonaws.com/arn%3Aaws%3Acloudformation%3Aap-northeast-1%3A702451219851%3Astack/StatusPage20161103-02/9d113e40-a199-11e6-8b95-50a686699882%7CAdminPageS3Object%7Ccd9ea963-9e5e-43fd-b5de-259502a5547e?AWSAccessKeyId=AKIAJZ7BPLUX22ESBRCQ&Expires=1478166440&Signature=7U7X2qLPs3q1GE4M4%2BifI1hZv7E%3D", "StackId": "arn:aws:cloudformation:ap-northeast-1:702451219851:stack/StatusPage20161103-02/9d113e40-a199-11e6-8b95-50a686699882", "RequestId": "cd9ea963-9e5e-43fd-b5de-259502a5547e", "LogicalResourceId": "AdminPageS3Object", "ResourceType": "Custom::S3PutObject", "ResourceProperties": { "ServiceToken": "arn:aws:lambda:ap-northeast-1:702451219851:function:StatusPage20161103-02-S3PutObjectFunction-MN753E9LC1C0", "Bucket": "statuspage20161103-02-adminpages3-bfd0s4vs8saf", "Body": "{\"ApiKey\": \"8nimlvp3hb\", \"InvocationURL\": \"https://omzh7gdq1b.execute-api.ap-northeast-1.amazonaws.com/prod/\"}", "Key": "api-info.json" } }
 */
