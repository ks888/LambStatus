import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import mkdirp from 'mkdirp'

dotenv.config({path: `${__dirname}/../../../.env`})

let awsResourceIDs = require('../build/aws_resource_ids.json')

let lambdaRoleArn, lambdaCustomResourceRoleArn
awsResourceIDs.forEach((resourceID) => {
  if (resourceID.OutputKey === 'LambdaRoleArn') {
    lambdaRoleArn = resourceID.OutputValue
  } else if (resourceID.OutputKey === 'LambdaCustomResourceRoleArn') {
    lambdaCustomResourceRoleArn = resourceID.OutputValue
  }
})
if (lambdaRoleArn === undefined || lambdaCustomResourceRoleArn === undefined) {
  console.log('Error: invalid aws_resource_ids.json')
  process.exit(1)
}

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

// some functions need a different role than default one.
const customResourceFunctionTemplate = {
  role: lambdaCustomResourceRoleArn
}
const functionJSON = JSON.stringify(customResourceFunctionTemplate, null, 2)
const targetDirs = [
  buildDir + '/functions/S3PutObject',
  buildDir + '/functions/S3SyncObjects'
]
targetDirs.forEach((dir) => {
  mkdirp.sync(dir)
  fs.writeFileSync(`${dir}/function.json`, functionJSON)
  console.log(`${dir}/function.json created`)
})
