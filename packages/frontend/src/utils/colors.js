export let getColor = (status) => {
  switch (status) {
    case 'Operational':
      return '#388e3c'
    case 'Outage':
      return '#c62828'
    default:
      return '#9e9e9e'
  }
}
