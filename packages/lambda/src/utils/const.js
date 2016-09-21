
import awsIDs from '../../build/aws_resource_ids.json'

export let ServiceComponentTable
export let IncidentTable

awsIDs.forEach((awsID) => {
  switch (awsID.OutputKey) {
    case 'ServiceComponentTable':
      ServiceComponentTable = awsID.OutputValue
      break
    case 'IncidentTable':
      IncidentTable = awsID.OutputValue
      break
  }
})
