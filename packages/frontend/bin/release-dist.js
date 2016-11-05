import path from 'path'
import dotenv from 'dotenv'
import { uploadDirectory, listObjects, deleteObjects } from './utils/s3'
import packageJSON from '../package.json'

dotenv.config({path: `${__dirname}/../../../.env`})
const { REGION: region } = process.env
const releaseBucketName = 'lambstatus'
const stopIfObjectsExist = true

const release = async (dir, prefix) => {
  try {
    const objectKeys = await listObjects(region, releaseBucketName, prefix)
    if (stopIfObjectsExist && objectKeys.length !== 0) {
      throw new Error('objects already exist under ' + prefix)
    }
    await deleteObjects(region, releaseBucketName, objectKeys)
    await uploadDirectory(dir, region, releaseBucketName, prefix)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
  }
}

const adminPageDir = path.normalize(`${__dirname}/../dist/admin-page`)
const adminPagePrefix = 'admin-page/' + packageJSON.version + '/'

const statusPageDir = path.normalize(`${__dirname}/../dist/status-page`)
const statusPagePrefix = 'status-page/' + packageJSON.version + '/'

release(adminPageDir, adminPagePrefix)
release(statusPageDir, statusPagePrefix)

// Note: if the deployed version is OK, set the version value inside `latest` object
