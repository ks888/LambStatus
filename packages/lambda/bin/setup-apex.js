import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import mkdirp from 'mkdirp'
import AWS from 'aws-sdk'

dotenv.config({path: '../../.env'})

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
    const { CLOUDFORMATION: stackName, REGION: region } = process.env
    const cloudFormation = new AWS.CloudFormation({ region })
    const stack = await describeStack({ cloudFormation, stackName })
    return stack.Outputs
  } catch (error) {
    console.error(error, error.stack)
  }
}

getStackOutput().then((stackOutputs) => {
  const {
    OutputKey: lambdaRoleArnKey,
    OutputValue: lambdaRoleArn
  } = stackOutputs[0]

  const { CLOUDFORMATION: stackName } = process.env
  const apexProjectTemplate = {
    name: stackName,
    description: 'Lambda Functions for LambStatus',
    memory: 128,
    timeout: 30,
    runtime: 'nodejs4.3',
    shim: false,
    role: lambdaRoleArn,
    nameTemplate: '{{.Project.Name}}-{{.Function.Name}}',
    handler: 'index.handler'
  }
  const json = JSON.stringify(apexProjectTemplate, null, 2)
  const buildDir = path.normalize(`${__dirname}/../build`)
  mkdirp.sync(buildDir)
  fs.writeFileSync(`${buildDir}/project.json`, json)
  console.log('project.json created')
})
