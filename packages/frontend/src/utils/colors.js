export let getComponentColor = (status) => {
  switch (status) {
    case 'Operational':
      return '#388e3c'
    case 'Outage':
      return '#c62828'
    default:
      return '#9e9e9e'
  }
}

export let getIncidentColor = (impact) => {
  switch (impact) {
    case 'investigating':
      return '#c62828'
    case 'identified':
      return '#c62828'
    case 'monitoring':
      return '#ef6c00'
    case 'resolved':
      return '#1976d2'
    default:
      return '#9e9e9e'
  }
}
