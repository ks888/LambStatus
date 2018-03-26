import ComponentsStore from 'db/components'

export async function handle (event, context, callback) {
  try {
    let comps = await new ComponentsStore().query()
    var downComp = []
    var compNum = comps.length
    let stat = { 'status': 'Operational' }
<<<<<<< HEAD
    comps.forEach(function (comp) {
      if (comp.status === 'Major Outage' || comp.status === 'Partial Outage') {
        if (comp.status === 'Major Outage') downComp.push(comp)
        stat = { 'status': (downComp.length < compNum ? 'Partial Outage' : 'Major Outage') }
      } else if (downComp.length === 0) {
        if (stat.status !== 'Degraded Performance' && comp.status === 'Under Maintenance') {
          stat = { 'status': 'Under Maintenance' }
        } else if (comp.status === 'Degraded Performance') {
          stat = { 'status': 'Degraded Performance' }
        }
      }
    })
	
=======
    comps.forEach(function(comp) {
        if (comp.status === 'Major Outage' || comp.status === 'Partial Outage') {
            if (comp.status === 'Major Outage') downComp.push(comp)
            stat = { 'status': (downComp.length < compNum ? 'Partial Outage' : 'Major Outage') }
        } else if (downComp.length === 0) {
            if (stat.status !== 'Degraded Performance' && comp.status === 'Under Maintenance') {
                stat = { 'status': 'Under Maintenance' }
            } else if (comp.status === 'Degraded Performance') {
                stat = { 'status': 'Degraded Performance' }
            }
        }
    })
>>>>>>> 36944843c204746669dc99f69360bd38027e4380
    callback(null, stat)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get current status')
  }
}
