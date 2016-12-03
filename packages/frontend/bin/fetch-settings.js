import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'

dotenv.config({path: `${__dirname}/../../../.env`})

function describeStack (cloudFormation, stackName) {
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

const findParameterKey = (params, paramKey) => {
  let paramValue
  params.forEach((param) => {
    if (param.ParameterKey === paramKey) {
      paramValue = param.ParameterValue
      return
    }
  })
  if (paramValue === undefined) {
    throw new Error(paramKey + ' not found')
  }
  return paramValue
}

const getSettings = async () => {
  try {
    const { STACK_NAME: stackName, AWS_REGION: region } = process.env
    const cloudFormation = new AWS.CloudFormation({ region })
    const stack = await describeStack(cloudFormation, stackName)

    const invocationURL = findOutputKey(stack.Outputs, 'InvocationURL')
    const statusPageURL = findOutputKey(stack.Outputs, 'StatusPageCloudFrontURL')
    const serviceName = findParameterKey(stack.Parameters, 'ServiceName')

    return { invocationURL, statusPageURL, serviceName }
  } catch (error) {
    console.error(error, error.stack)
    throw error
  }
}

const getBucketInfo = async () => {
  try {
    const { STACK_NAME: stackName, AWS_REGION: region } = process.env
    const cloudFormation = new AWS.CloudFormation({ region })
    const stack = await describeStack(cloudFormation, stackName)

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

getSettings().then((
  { invocationURL, statusPageURL, serviceName }
) => {
  const apiInfo = {
    InvocationURL: invocationURL,
    StatusPageURL: statusPageURL,
    ServiceName: serviceName
  }
  return JSON.stringify(apiInfo, null, 2)
}).then((json) => {
  const configDir = path.normalize(`${__dirname}/../config`)
  fs.writeFileSync(`${configDir}/settings.json`, json)
  console.log('settings.json created')
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
  process.exit(1)
})
