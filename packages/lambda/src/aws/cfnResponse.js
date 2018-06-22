// Promised version of cfn-response module.
/* Copyright 2015 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.
   This file is licensed to you under the AWS Customer Agreement (the "License").
   You may not use this file except in compliance with the License.
   A copy of the License is located at http://aws.amazon.com/agreement/.
   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied.
   See the License for the specific language governing permissions and limitations under the License. */

import https from 'https'
import url from 'url'

const responseSuccess = 'SUCCESS'
const responseFailed = 'FAILED'

export default class Response {
  static async sendSuccess (event, context, responseData, physicalResourceId) {
    return await this.send(event, context, responseSuccess, responseData, physicalResourceId)
  }

  static async sendFailed (event, context, responseData, physicalResourceId) {
    return await this.send(event, context, responseFailed, responseData, physicalResourceId)
  }

  static send (event, context, responseStatus, responseData, physicalResourceId) {
    let responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: 'See the details in CloudWatch Log Stream: ' + context.logStreamName,
      PhysicalResourceId: physicalResourceId || context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: responseData
    })

    console.log('Response body:\n', responseBody)

    let parsedUrl = url.parse(event.ResponseURL)
    let options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        'content-type': '',
        'content-length': responseBody.length
      }
    }

    return new Promise((resolve, reject) => {
      let request = https.request(options, (response) => {
        console.log('Status code: ' + response.statusCode)
        console.log('Status message: ' + response.statusMessage)
        context.done()
        resolve()
      })

      request.on('error', (error) => {
        console.log('send(..) failed executing https.request(..): ' + error)
        context.done()
        reject(new Error('failed to send the request'))
      })

      request.write(responseBody)
      request.end()
    })
  }
}
