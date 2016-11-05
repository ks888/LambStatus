import path from 'path'
import dotenv from 'dotenv'
import deployInfo from '../config/deploy-info.json'
import { uploadDirectory } from './utils/s3'

dotenv.config({path: `${__dirname}/../../../.env`})
const { REGION: region } = process.env

const upload = async () => {
  const adminPageDir = path.normalize(`${__dirname}/../dist/admin-page`)
  const adminPageBucketName = deployInfo.AdminPageS3BucketName

  const statusPageDir = path.normalize(`${__dirname}/../dist/status-page`)
  const statusPageBucketName = deployInfo.StatusPageS3BucketName

  try {
    await uploadDirectory(adminPageDir, region, adminPageBucketName)
    await uploadDirectory(statusPageDir, region, statusPageBucketName)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
  }
}

upload()
