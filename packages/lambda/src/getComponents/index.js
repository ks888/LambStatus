
export async function handler (event, context, callback) {
  console.log('getComponents called')
  callback( null, { "test": "desu" } )
}
