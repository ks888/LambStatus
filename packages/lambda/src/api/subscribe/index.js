import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'
import { Subscriber } from 'model/subscription'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  try {
    const clientID = await new CloudFormation(stackName).getSubscribersPoolClientID()
    const email = event.emailAddress
    const subscriber = new Subscriber(email)
    subscriber.validate()

    await new Cognito().signUp(clientID, subscriber)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to subscribe the events')
    }
  }
}
