const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const mkdirp = require('mkdirp')
const AWS = require('aws-sdk')

dotenv.config({path: `${__dirname}/../../../.env`})

const describeStack = (cloudFormation, stackName) => {
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

const { STACK_NAME: stackName, AWS_REGION: region } = process.env
const cloudFormation = new AWS.CloudFormation({ region })

describeStack(cloudFormation, stackName).then((stack) => {
  return JSON.stringify(stack.Outputs, null, 2)
}).then((json) => {
  const buildDir = path.normalize(`${__dirname}/../build`)
  mkdirp.sync(buildDir)
  fs.writeFileSync(`${buildDir}/aws_resource_ids.json`, json)
  console.log('aws_resource_ids.json created')
}).catch((error) => {
  console.error(error, error.stack)
  process.exit(1)
})
