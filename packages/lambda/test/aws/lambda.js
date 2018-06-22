import assert from 'assert'
import AWS from 'aws-sdk-mock'
import Lambda from 'aws/lambda'

describe('Lambda', () => {
  afterEach(() => {
    AWS.restore('Lambda')
  })

  describe('addPermission', () => {
    it('should call addPermission func', async () => {
      let actual
      AWS.mock('Lambda', 'addPermission', (params, callback) => {
        actual = params
        callback(null)
      })

      const functionName = 'arn:aws:lambda:ap-northeast-1:account:function:Name'
      const principal = 'sns.amazonaws.com'
      const sourceARN = 'arn:aws:sns:ap-northeast-1:account:IncidentNotification'
      await new Lambda().addPermission(functionName, principal, sourceARN)
      assert(actual.Action === 'lambda:InvokeFunction')
      assert(actual.FunctionName === functionName)
      assert(actual.Principal === principal)
      assert(actual.SourceArn === sourceARN)
      assert(actual.StatementId !== undefined)
    })
  })
})
