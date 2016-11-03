import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'

dotenv.config({path: `${__dirname}/../../../.env`})

function describeStack ({ cloudFormation, stackName }) {
  return new Promise((resolve, reject) => {
    const params = {
      StackName: stackName
    }
    cloudFormation.describeStacks(params, (error, data) => {
      if (error) {
        return reject(error)
      }
      if (!data) {
        return reject(new Error('describeStacks returned no data'))
      }
      const { Stacks: stacks } = data
      if (!stacks || stacks.length !== 1) {
        return reject(new Error('describeStacks unexpected number of stacks'))
      }
      const stack = stacks[0]
      resolve(stack)
    })
  })
}

const findOutputKey = (outputs, outputKey) => {
  let outputValue
  outputs.forEach((output) => {
    if (output.OutputKey === outputKey) {
      outputValue = output.OutputValue
      return
    }
  })
  if (outputValue === undefined) {
    throw new Error(outputKey + ' not found')
  }
  return outputValue
}

function getApiKey (apiGateway, apiKeyID) {
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

const getApiInfo = async () => {
  try {
    const { CLOUDFORMATION: stackName, AWS_REGION: region } = process.env
    const cloudFormation = new AWS.CloudFormation({ region })
    const stack = await describeStack({ cloudFormation, stackName })

    const apiKeyID = findOutputKey(stack.Outputs, 'ApiKeyID')
    const invocationURL = findOutputKey(stack.Outputs, 'InvocationURL')

    const apiGateway = new AWS.APIGateway({ region })
    const apiKey = await getApiKey(apiGateway, apiKeyID)
    return { apiKey, invocationURL }
  } catch (error) {
    console.error(error, error.stack)
    throw error
  }
}

const getBucketInfo = async () => {
  try {
    const { CLOUDFORMATION: stackName, AWS_REGION: region } = process.env
    const cloudFormation = new AWS.CloudFormation({ region })
    const stack = await describeStack({ cloudFormation, stackName })

    const adminPageS3BucketURL = findOutputKey(stack.Outputs, 'AdminPageS3BucketURL')
    const adminPageS3BucketName = findOutputKey(stack.Outputs, 'AdminPageS3BucketName')

    const statusPageS3BucketURL = findOutputKey(stack.Outputs, 'StatusPageS3BucketURL')
    const statusPageS3BucketName = findOutputKey(stack.Outputs, 'StatusPageS3BucketName')
    return { adminPageS3BucketURL, adminPageS3BucketName, statusPageS3BucketURL, statusPageS3BucketName }
  } catch (error) {
    console.error(error, error.stack)
    throw error
  }
}

getApiInfo().then((
  { apiKey, invocationURL }
) => {
  const apiInfo = {
    'ApiKey': apiKey,
    'InvocationURL': invocationURL
  }
  return JSON.stringify(apiInfo, null, 2)
}).then((json) => {
  const configDir = path.normalize(`${__dirname}/../config`)
  fs.writeFileSync(`${configDir}/api-info.json`, json)
  console.log('api-info.json created')
}).catch((error) => {
  console.error(error, error.stack)
})

getBucketInfo().then((
  { adminPageS3BucketURL, adminPageS3BucketName, statusPageS3BucketURL, statusPageS3BucketName }
) => {
  const deployInfo = {
    'AdminPageS3BucketURL': adminPageS3BucketURL,
    'AdminPageS3BucketName': adminPageS3BucketName,
    'StatusPageS3BucketURL': statusPageS3BucketURL,
    'StatusPageS3BucketName': statusPageS3BucketName
  }
  return JSON.stringify(deployInfo, null, 2)
}).then((json) => {
  const configDir = path.normalize(`${__dirname}/../config`)
  fs.writeFileSync(`${configDir}/deploy-info.json`, json)
  console.log('deploy-info.json created')
}).catch((error) => {
  console.error(error, error.stack)
})
