import path from 'path'
import dotenv from 'dotenv'
import { uploadDirectory, listObjects, deleteObjects } from './utils/s3'
import packageJSON from '../package.json'

dotenv.config({path: `${__dirname}/../../../.env`})
const { REGION: region } = process.env
const releaseBucketName = 'lambstatus'
const stopIfObjectsExist = (process.argv[2] !== '--force')

const release = async (dir, prefix) => {
  try {
    const objectKeys = await listObjects(region, releaseBucketName, prefix)
    if (objectKeys.length !== 0) {
      if (stopIfObjectsExist) {
        throw new Error('objects already exist under ' + prefix)
      }
      await deleteObjects(region, releaseBucketName, objectKeys)
    }
    await uploadDirectory(dir, region, releaseBucketName, prefix)
    await deleteObjects(region, releaseBucketName, [{ Key: prefix + 'settings.js' }])
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
  }
}

const adminPageDir = path.normalize(`${__dirname}/../dist/admin-page`)
const adminPagePrefix = 'admin-page/' + packageJSON.version + '/'

const statusPageDir = path.normalize(`${__dirname}/../dist/status-page`)
const statusPagePrefix = 'status-page/' + packageJSON.version + '/'

release(adminPageDir, adminPagePrefix).then(() => {
  console.log('released admin page')
})

release(statusPageDir, statusPagePrefix).then(() => {
  console.log('released status page')
})
