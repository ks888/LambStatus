const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const mkdirp = require('mkdirp')

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
  runtime: 'nodejs6.10',
  shim: false,
  role: lambdaRoleArn,
  nameTemplate: '{{.Project.Name}}-{{.Function.Name}}'
}
const json = JSON.stringify(apexProjectTemplate, null, 2)
const buildDir = path.normalize(`${__dirname}/../build`)
mkdirp.sync(buildDir)
fs.writeFileSync(`${buildDir}/project.json`, json)
console.log('project.json created')

const createFunctionJSON = (role, timeout, memory, targetDirs) => {
  const functionJSON = JSON.stringify({role, timeout, memory}, null, 2)
  targetDirs.forEach((dir) => {
    mkdirp.sync(dir)
    fs.writeFileSync(`${dir}/function.json`, functionJSON)
    console.log(`${dir}/function.json created`)
  })
}
createFunctionJSON(lambdaRoleArn, 60, 512, [
  buildDir + '/functions/CollectMetricsData',
  buildDir + '/functions/GetExternalMetrics'
])
createFunctionJSON(lambdaRoleArn, 60, 128, [
  buildDir + '/functions/PostMetricsData'
])
