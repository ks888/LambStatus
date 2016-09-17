import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import mkdirp from 'mkdirp'

dotenv.config({path: `${__dirname}/../../../.env`})

let awsResourceIDs = require('../build/aws_resource_ids.json')

let lambdaRoleArn
awsResourceIDs.some((resourceID) => {
  if (resourceID.OutputKey === 'LambdaRoleArn') {
    lambdaRoleArn = resourceID.OutputValue
    return true
  }
})
if (lambdaRoleArn === undefined) {
  console.log('Error: aws_resource_ids.json does not have LambdaRoleArn entry.')
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
