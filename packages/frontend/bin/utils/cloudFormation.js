import AWS from 'aws-sdk'

const { AWS_REGION: region } = process.env

const describeStack = (stackName) => {
  const cloudFormation = new AWS.CloudFormation({ region })
  return new Promise((resolve, reject) => {
    const params = { StackName: stackName }
    cloudFormation.describeStacks(params, (error, data) => {
      if (error) {
        return reject(error)
      }
      if (!data) {
        return reject(new Error('no data'))
      }
      const { Stacks: stacks } = data
      if (!stacks || stacks.length !== 1) {
        return reject(new Error('unexpected number of stacks'))
      }
      const stack = stacks[0]
      resolve(stack)
    })
  })
}

const findOutputKey = (outputs, outputKey) => {
  let outputValue
  outputs.forEach((output) => {
    if (output.OutputKey === outputKey) {
      outputValue = output.OutputValue
    }
  })
  if (outputValue === undefined) {
    throw new Error(outputKey + ' not found')
  }
  return outputValue
}

export const getOutputs = async (stackName, outputKeys) => {
  const stack = await describeStack(stackName)

  const outputs = {}
  outputKeys.forEach(key => {
    outputs[key] = findOutputKey(stack.Outputs, key)
  })
  return outputs
}
