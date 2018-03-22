import ComponentsStore from 'db/components'

export async function handle (event, context, callback) {
  try {
    let comps = await new ComponentsStore().query()
    var downComp = []
    comps.forEach(function (comp) {
      if (comp.status === 'Major Outage') {
        downComp.push(comp.name)
      }
    })
    let stat = { 'status': (downComp.length > 0 ? 'Major Outage' : 'Operational'), 'componentOutages': downComp }
    callback(null, stat)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get current status')
  }
}
