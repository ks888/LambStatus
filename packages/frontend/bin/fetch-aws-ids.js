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

getApiInfo().then(({ apiKey, invocationURL }) => {
  let apiInfo = {
    'ApiKey': apiKey,
    'InvocationURL': invocationURL
  }
  return JSON.stringify(apiInfo, null, 2)
}).then((json) => {
  const configDir = path.normalize(`${__dirname}/../config`)
  fs.writeFileSync(`${configDir}/api.json`, json)
  console.log('api.json created')
}).catch((error) => {
  console.error(error, error.stack)
})
