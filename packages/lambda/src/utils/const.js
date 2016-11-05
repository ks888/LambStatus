const stackName = process.env.AWS_LAMBDA_FUNCTION_NAME.replace(/-[^-]*$/, '')
export const ServiceComponentTable = `${stackName}-ServiceComponentTable`
export const IncidentTable = `${stackName}-IncidentTable`
export const IncidentUpdateTable = `${stackName}-IncidentUpdateTable`

export const componentStatuses = ['Operational', 'Under Maintenance', 'Degraded Performance', 'Outage']
export const incidentStatuses = ['Investigating', 'Identified', 'Monitoring', 'Resolved']
