
import awsIDs from '../../build/aws_resource_ids.json'

export let ServiceComponentTable
export let IncidentTable
export let IncidentUpdateTable

awsIDs.forEach((awsID) => {
  switch (awsID.OutputKey) {
    case 'ServiceComponentTable':
      ServiceComponentTable = awsID.OutputValue
      break
    case 'IncidentTable':
      IncidentTable = awsID.OutputValue
      break
    case 'IncidentUpdateTable':
      IncidentUpdateTable = awsID.OutputValue
      break
  }
})
