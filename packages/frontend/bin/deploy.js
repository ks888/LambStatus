import path from 'path'
import dotenv from 'dotenv'
import { getOutputs } from './utils/cloudFormation'
import { uploadDirectory } from './utils/s3'

dotenv.config({path: `${__dirname}/../../../.env`})

const { STACK_NAME: stackName, REGION: region } = process.env

const getDestinations = async () => {
  return await getOutputs(stackName, ['AdminPageS3BucketName', 'StatusPageS3BucketName'])
}

const upload = async () => {
  const {
    AdminPageS3BucketName,
    StatusPageS3BucketName
  } = await getDestinations()
  const adminPageDir = path.normalize(`${__dirname}/../dist/admin-page`)
  const statusPageDir = path.normalize(`${__dirname}/../dist/status-page`)

  try {
    await uploadDirectory(adminPageDir, region, AdminPageS3BucketName)
    await uploadDirectory(statusPageDir, region, StatusPageS3BucketName)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
  }
}

upload().then(() => {
  console.log('deployed admin & status page')
})
