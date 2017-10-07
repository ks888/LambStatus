import APIGateway from 'aws/apiGateway'

export async function handle (event, context, callback) {
  try {
    await new APIGateway().disableAndDeleteApiKey(event.params.apikeyid)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to delete the api key')
    }
  }
}
