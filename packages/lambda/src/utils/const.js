const stackName = process.env.AWS_LAMBDA_FUNCTION_NAME.replace(/-[^-]*$/, '')
export const ServiceComponentTable = `${stackName}-ServiceComponentTable`
export const IncidentTable = `${stackName}-IncidentTable`
export const IncidentUpdateTable = `${stackName}-IncidentUpdateTable`
export const MetricsTable = `${stackName}-MetricsTable`
export const MetricsDataTable = `${stackName}-MetricsDataTable`

export const componentStatuses = ['Operational', 'Under Maintenance', 'Degraded Performance', 'Partial Outage',
  'Major Outage']
export const incidentStatuses = ['Investigating', 'Identified', 'Monitoring', 'Resolved']
export const monitoringServices = ['CloudWatch']
export const metricStatuses = ['Visible', 'Hidden']

export const region = process.env.AWS_DEFAULT_REGION
