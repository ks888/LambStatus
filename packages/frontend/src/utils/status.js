export const componentStatuses = ['Operational', 'Under Maintenance', 'Degraded Performance', 'Partial Outage',
  'Major Outage']

export const getComponentColor = (status) => {
  switch (status) {
    case 'Operational':
      return '#388e3c'
    case 'Under Maintenance':
      return '#0277bd'
    case 'Degraded Performance':
      return '#fbc02d'
    case 'Partial Outage':
      return '#ef6c00'
    case 'Major Outage':
      return '#c62828'
    default:
      return '#9e9e9e'
  }
}

export const incidentStatuses = ['Investigating', 'Identified', 'Monitoring', 'Resolved']

export const getIncidentColor = (impact) => {
  switch (impact) {
    case 'Investigating':
      return '#c62828'
    case 'Identified':
      return '#ef6c00'
    case 'Monitoring':
      return '#0277bd'
    case 'Resolved':
      return '#388e3c'
    default:
      return '#9e9e9e'
  }
}

export const cloudWatchMonitoringService = 'CloudWatch'
export const monitoringServices = [cloudWatchMonitoringService]
export const metricStatuses = ['Hidden', 'Visible']

export const getMetricColor = (impact) => {
  switch (impact) {
    case 'Visible':
      return '#388e3c'
    case 'Hidden':
      return '#9e9e9e'
    default:
      return '#9e9e9e'
  }
}

export const maintenanceStatuses = ['Scheduled', 'In Progress', 'Verifying', 'Completed']

export const getMaintenanceColor = (impact) => {
  switch (impact) {
    case 'Scheduled':
      return '#0277bd'
    case 'In Progress':
      return '#ef6c00'
    case 'Verifying':
      return '#0277bd'
    case 'Completed':
      return '#388e3c'
    default:
      return '#9e9e9e'
  }
}

export const timeframeDay = 'Day'
export const timeframeWeek = 'Week'
export const timeframeMonth = 'Month'
export const timeframes = [timeframeDay, timeframeWeek, timeframeMonth]

export const getXAxisFormat = (timeframe) => {
  switch (timeframe) {
    case 'Day':
      return (x) => {
        if (x.getMinutes() >= 55) {
          return `${x.getHours() + 1}:00`
        }
        return `${x.getHours()}:${Math.round(x.getMinutes() / 10)}0`
        /*
        // Round minutes. It seems too vague.
        const inc = x.getMinutes() > 30 ? 1 : 0
        return `${x.getHours() + inc}:00`
        */
      }
    default:
      return (x) => { return `${x.getMonth() + 1}/${x.getDate()}` }
  }
}

export const getTooltipTitleFormat = (timeframe) => {
  switch (timeframe) {
    case 'Day':
      return (x) => {
        const padding = x.getMinutes() < 10 ? '0' : ''
        return `${x.getMonth() + 1}/${x.getDate()} - ${x.getHours()}:${padding}${x.getMinutes()}`
      }
    default:
      return (x) => { return `${x.getMonth() + 1}/${x.getDate()} - ${x.getHours()}:00` }
  }
}

export const getIncrementTimestampFunc = (timeframe) => {
  switch (timeframe) {
    case 'Day':
      return timestamp => timestamp.setMinutes(timestamp.getMinutes() + 5)
    case 'Week':
      return timestamp => timestamp.setHours(timestamp.getHours() + 1)
    default:
      return timestamp => timestamp.setHours(timestamp.getHours() + 3)
  }
}

export const getNumDates = (timeframe) => {
  switch (timeframe) {
    case 'Day':
      return 1
    case 'Week':
      return 7
    default:
      return 30
  }
}

export const regions = [
  {id: 'us-east-1', name: 'US East (N. Virginia)'},
  {id: 'us-east-2', name: 'US East (Ohio)'},
  {id: 'us-west-1', name: 'US West (N. California)'},
  {id: 'us-west-2', name: 'US West (Oregon)'},
  {id: 'ca-central-1', name: 'Canada (Central)'},
  {id: 'eu-west-1', name: 'EU (Ireland)'},
  {id: 'eu-central-1', name: 'EU (Frankfurt)'},
  {id: 'eu-west-2', name: 'EU (London)'},
  {id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)'},
  {id: 'ap-northeast-2', name: 'Asia Pacific (Seoul)'},
  {id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)'},
  {id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)'},
  {id: 'ap-south-1', name: 'Asia Pacific (Mumbai)'},
  {id: 'sa-east-1', name: 'South America (São Paulo)'}
]
