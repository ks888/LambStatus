import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import { putObject, listObjects } from '../src/utils/s3'
import packageJSON from '../package.json'

const stopIfObjectsExist = (process.argv[2] !== '--force')

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
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
    const stdout = execSync(cmd, { cwd: buildDir })
    fs.writeFileSync(`${buildDir}/${funcName}.zip`, stdout)
    console.log(`${funcName}.zip created`)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    throw error
  }
}

const release = async () => {
  const funcs = fs.readdirSync(funcsDir)
  funcs.forEach((func) => {
    buildFunc(func)
  })
  if (stopIfObjectsExist) {
    await Promise.all(regions.map(async (region) => {
      const bucketName = 'lambstatus-' + region
      const keyName = `fn/${packageJSON.version}`
      const objectKeys = await listObjects(region, bucketName, keyName)
      if (objectKeys.length !== 0) {
        throw new Error(`objects already exist under ${bucketName}/${keyName}`)
      }
    }))
  }
  await Promise.all(funcs.map(async (func) => {
    const objectName = `fn/${packageJSON.version}/${func}.zip`
    const body = fs.readFileSync(`${buildDir}/${func}.zip`)
    await Promise.all(regions.map(async (region) => {
      const bucketName = 'lambstatus-' + region
      await putObject(region, bucketName, objectName, body)
    }))
    console.log(`uploaded: ${func}.zip`)
  }))
}

release().catch((error) => {
  console.log(error.message)
  console.log(error.stack)
})
