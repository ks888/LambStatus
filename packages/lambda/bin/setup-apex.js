import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import mkdirp from 'mkdirp'
import AWS from 'aws-sdk'

dotenv.config({path: `${__dirname}/../../../.env`})

let awsResourceIDs = require('../build/aws_resource_ids.json')
const lambdaRoleArnKey = awsResourceIDs[1].OutputKey
const lambdaRoleArn = awsResourceIDs[1].OutputValue
if (lambdaRoleArnKey != 'LambdaRoleArn') {
  console.log('Error: aws resource file is unexpected format (key name is ' + lambdaRoleArnKey + ')')
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
