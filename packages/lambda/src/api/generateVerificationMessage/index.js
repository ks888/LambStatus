import querystring from 'querystring'
import CloudFormation from 'aws/cloudFormation'
import { SettingsProxy } from 'api/utils'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  try {
    const settings = new SettingsProxy()
    const serviceName = await settings.getServiceName()
    const cloudFormation = new CloudFormation(stackName)
    const statusPageURL = await cloudFormation.getStatusPageCloudFrontURL()
    const code = event.request.codeParameter
    const username = event.userName

    const confirmationURL = buildConfirmURL(statusPageURL, code, username)

    const smsMessage = `Confirmation by SMS is not supported yet (${code})`
    const emailMessage = generateEmailMessage(serviceName, confirmationURL)
    const emailSubject = generateEmailSubject(serviceName)

    callback(null, {
      ...event,
      response: {smsMessage, emailMessage, emailSubject}
    })
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to generate message')
  }
}

export const generateEmailMessage = (serviceName, confirmationURL) => {
  return `Thank you for subscribing to ${serviceName} incident updates. Please click the following link to confirm your subscription: ${confirmationURL}`
}

export const generateEmailSubject = (serviceName) => {
  return `[${serviceName} status] confirm your subscription`
}

export const buildConfirmURL = (statusPageURL, code, username) => {
  // do not encode code value since cognito will replace it later.
  const query = `username=${querystring.escape(username)}&code=${code}`
  return `${statusPageURL}/api/subscribers/confirm?${query}`
}
