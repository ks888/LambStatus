import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { getOutputs } from './cloudFormation'

dotenv.config({path: `${__dirname}/../../../../.env`})

const { STACK_NAME: stackName } = process.env

const getSettings = async () => {
  const keys = ['AdminPageCloudFrontURL', 'StatusPageCloudFrontURL', 'UserPoolID', 'UserPoolClientID']
  try {
    return await getOutputs(stackName, keys)
  } catch (err) {
    throw err
  }
}

const createSettingsJs = async (isAdminPage = true) => {
  const settings = await getSettings()

  let body
  if (isAdminPage) {
    body = `
__LAMBSTATUS_API_URL__ = '${settings.AdminPageCloudFrontURL}';
__LAMBSTATUS_USER_POOL_ID__ = '${settings.UserPoolID}';
__LAMBSTATUS_CLIENT_ID__ = '${settings.UserPoolClientID}';
`
  } else {
    body = `
__LAMBSTATUS_API_URL__ = '${settings.StatusPageCloudFrontURL}';
`
  }
  const configDir = path.normalize(`${__dirname}/../../config`)
  fs.writeFileSync(`${configDir}/settings.js`, body)
}

export default createSettingsJs
