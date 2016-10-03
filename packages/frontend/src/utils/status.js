export let componentStatuses = ['Operational', 'Under Maintenance', 'Degraded Performance', 'Outage']

export let getComponentColor = (status) => {
  switch (status) {
    case 'Operational':
      return '#388e3c'
    case 'Under Maintenance':
      return '#0288d1'
    case 'Degraded Performance':
      return '#ffa000'
    case 'Outage':
      return '#c62828'
    default:
      return '#9e9e9e'
  }
}

export let incidentStatuses = ['investigating', 'identified', 'monitoring', 'resolved']

export let getIncidentColor = (impact) => {
  switch (impact) {
    case 'investigating':
      return '#c62828'
    case 'identified':
      return '#ffa000'
    case 'monitoring':
      return '#0288d1'
    case 'resolved':
      return '#388e3c'
    default:
      return '#9e9e9e'
  }
}
