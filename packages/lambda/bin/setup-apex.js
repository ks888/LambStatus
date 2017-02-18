import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import mkdirp from 'mkdirp'

dotenv.config({path: `${__dirname}/../../../.env`})

let awsResourceIDs = require('../build/aws_resource_ids.json')

const getArn = (resourceIDs, keyName) => {
  let arn
  resourceIDs.some((resourceID) => {
    if (resourceID.OutputKey === keyName) {
      arn = resourceID.OutputValue
      return true
    }
  })
  if (!arn) {
    console.log('Error: no required arn')
    process.exit(1)
  }
  return arn
}

const lambdaRoleArn = getArn(awsResourceIDs, 'LambdaRoleArn')
const { STACK_NAME: stackName } = process.env
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

// some lambda functions need a different role than default one.
const createFunctionJSON = (arn, targetDirs) => {
  const functionJSON = JSON.stringify({role: arn}, null, 2)
  targetDirs.forEach((dir) => {
    mkdirp.sync(dir)
    fs.writeFileSync(`${dir}/function.json`, functionJSON)
    console.log(`${dir}/function.json created`)
  })
}

const metricsFunctionRoleArn = getArn(awsResourceIDs, 'MetricsFunctionRoleArn')
createFunctionJSON(metricsFunctionRoleArn, [
  buildDir + '/functions/CollectMetricsData',
  buildDir + '/functions/GetMetrics',
  buildDir + '/functions/PostMetrics',
  buildDir + '/functions/GetExternalMetrics'
])
const s3HandleFunctionRoleArn = getArn(awsResourceIDs, 'S3HandleFunctionRoleArn')
createFunctionJSON(s3HandleFunctionRoleArn, [
  buildDir + '/functions/S3PutObject',
  buildDir + '/functions/S3SyncObjects'
])
const cognitoHandleFunctionRoleArn = getArn(awsResourceIDs, 'CognitoHandleFunctionRoleArn')
createFunctionJSON(cognitoHandleFunctionRoleArn, [
  buildDir + '/functions/CognitoCreateUser',
  buildDir + '/functions/CognitoCreateUserPool',
  buildDir + '/functions/CognitoCreateUserPoolClient'
])
