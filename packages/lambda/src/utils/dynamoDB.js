import AWS from 'aws-sdk'
import WError from 'verror'
import { ServiceComponentTable } from './const'

export default function() {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB({ region })

  return new Promise((resolve, reject) => {
    const params = {
      TableName: ServiceComponentTable,
      ProjectionExpression: 'ID, description, #nm, #st',
      ExpressionAttributeNames: {
        "#nm": "name",
        "#st": "status",
      }
    }
    awsDynamoDb.scan(params, (err, scanResult) => {
      if (err) {
        return reject(new WError(err, 'DynamoDB'))
      }
      let components = []
      scanResult.Items.forEach((component) => {
        const {
          ID: {
            S: compID
          },
          name: {
            S: compName
          },
          status: {
            S: compStatus
          },
          description: {
            S: compDesc
          }
        } = component
        components.push({
          "ID": compID,
          "name": compName,
          "status": compStatus,
          "description": compDesc,
        })
      })

      resolve(components)
    })
  })
}
