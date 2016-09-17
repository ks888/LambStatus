
import awsIDs from '../../build/aws_resource_ids.json'

export let ServiceComponentTable

awsIDs.forEach((awsID) => {
  switch (awsID.OutputKey) {
    case 'ServiceComponentTable':
      ServiceComponentTable = awsID.OutputValue
      break
  }
})
