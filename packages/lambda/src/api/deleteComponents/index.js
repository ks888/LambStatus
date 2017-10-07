import ComponentsStore from 'db/components'

export async function handle (event, context, callback) {
  try {
    const store = new ComponentsStore()
    await store.delete(event.params.componentid)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to delete the component')
  }
}
