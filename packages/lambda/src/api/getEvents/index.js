export default async (eventStore) => {
  try {
    const events = await eventStore.query()
    return events.map(event => event.objectify())
  } catch (error) {
    throw new Error('failed to get events list')
  }
}
