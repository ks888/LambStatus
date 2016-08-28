import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import mkdirp from 'mkdirp'
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

async function getStackOutput() {
  try {
    const { CLOUDFORMATION: stackName, AWS_REGION: region } = process.env
    const cloudFormation = new AWS.CloudFormation({ region })
    const stack = await describeStack({ cloudFormation, stackName })
    return stack.Outputs
  } catch (error) {
    console.error(error, error.stack)
  }
}

getStackOutput().then((output) => {
  return JSON.stringify(output, null, 2)
}).then((json) => {
  const buildDir = path.normalize(`${__dirname}/../build`)
  mkdirp.sync(buildDir)
  fs.writeFileSync(`${buildDir}/aws_resource_ids.json`, json)
  console.log('aws_resource_ids.json created')
}).catch((error) => {
  console.error(error, error.stack)
})
