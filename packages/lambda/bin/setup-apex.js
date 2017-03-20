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
  nameTemplate: '{{.Project.Name}}-{{.Function.Name}}'
}
const json = JSON.stringify(apexProjectTemplate, null, 2)
const buildDir = path.normalize(`${__dirname}/../build`)
mkdirp.sync(buildDir)
fs.writeFileSync(`${buildDir}/project.json`, json)
console.log('project.json created')

// some lambda functions need a different role than default one.
const createFunctionJSON = (role, timeout, memory, targetDirs) => {
  const functionJSON = JSON.stringify({role, timeout, memory}, null, 2)
  targetDirs.forEach((dir) => {
    mkdirp.sync(dir)
    fs.writeFileSync(`${dir}/function.json`, functionJSON)
    console.log(`${dir}/function.json created`)
  })
}
const metricsFunctionRoleArn = getArn(awsResourceIDs, 'MetricsFunctionRoleArn')
createFunctionJSON(metricsFunctionRoleArn, 60, 512, [
  buildDir + '/functions/CollectMetricsData'
])
createFunctionJSON(metricsFunctionRoleArn, 30, 128, [
  buildDir + '/functions/GetExternalMetrics'
])
const s3HandleFunctionRoleArn = getArn(awsResourceIDs, 'S3HandleFunctionRoleArn')
createFunctionJSON(s3HandleFunctionRoleArn, 30, 128, [
  buildDir + '/functions/S3PutObject',
  buildDir + '/functions/S3SyncObjects'
])
/*
const cognitoHandleFunctionRoleArn = getArn(awsResourceIDs, 'CognitoHandleFunctionRoleArn')
createFunctionJSON(cognitoHandleFunctionRoleArn, 30, 128, [
  buildDir + '/functions/CognitoCreateUser',
  buildDir + '/functions/CognitoCreateUserPool',
  buildDir + '/functions/CognitoCreateUserPoolClient'
])
*/
