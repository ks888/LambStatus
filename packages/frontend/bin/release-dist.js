import path from 'path'
import dotenv from 'dotenv'
import deployInfo from '../config/deploy-info.json'
import { uploadDirectory } from './utils/s3'

dotenv.config({path: `${__dirname}/../../../.env`})
const { REGION: region } = process.env

const adminPageDir = path.normalize(`${__dirname}/../dist/admin-page`)
const adminPageBucketName = deployInfo.AdminPageS3BucketName
uploadDirectory(adminPageDir, region, adminPageBucketName)

const statusPageDir = path.normalize(`${__dirname}/../dist/status-page`)
const statusPageBucketName = deployInfo.StatusPageS3BucketName
uploadDirectory(statusPageDir, region, statusPageBucketName)
