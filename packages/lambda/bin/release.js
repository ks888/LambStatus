import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import S3 from '../src/aws/s3'
import packageJSON from '../package.json'

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ca-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-central-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-south-1',
  'sa-east-1'
]

const buildDir = path.normalize(`${__dirname}/../build`)
const funcsDir = path.normalize(`${buildDir}/functions`)

const buildFunc = (funcName) => {
  const cmd = `apex build ${funcName}`
  try {
    const numRetries = 3
    let stdout
    for (let i = 0; i < numRetries; i++) {
      stdout = execSync(cmd, { cwd: buildDir, maxBuffer: 100 * 1024 * 1024 })
      // sometimes 'apex build' writes nothing to stdout.
      if (stdout.length !== 0) {
        break
      }
      console.log('retry...')
    }
    if (stdout.length === 0) {
      throw new Error('failed to create zip file')
    }
    fs.writeFileSync(`${buildDir}/${funcName}.zip`, stdout)
    console.log(`${funcName}.zip created`)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    throw error
  }
}

const release = async (stopIfObjectsExist) => {
  const funcs = fs.readdirSync(funcsDir)
  funcs.forEach((func) => {
    buildFunc(func)
  })
  if (stopIfObjectsExist) {
    await Promise.all(regions.map(async (region) => {
      const bucketName = 'lambstatus-' + region
      const keyName = `fn/${packageJSON.version}`
      const objectKeys = await new S3().listObjects(region, bucketName, keyName)
      if (objectKeys.length !== 0) {
        throw new Error(`objects already exist under ${bucketName}/${keyName}`)
      }
    }))
  }

  await Promise.all(regions.map(async region => {
    const bucketName = 'lambstatus-' + region
    for (let i = 0; i < funcs.length; i++) {
      const func = funcs[i]
      const objectName = `fn/${packageJSON.version}/${func}.zip`
      const body = fs.readFileSync(`${buildDir}/${func}.zip`)
      await new S3().putObject(region, bucketName, objectName, body)
    }
    console.log(`uploaded to ${region}`)
  }))
}

release(process.argv[2] !== '--force').catch((error) => {
  console.log(error.message)
  console.log(error.stack)
})
