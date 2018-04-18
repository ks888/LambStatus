export default async (eventStore) => {
  try {
    return await eventStore.query()
  } catch (error) {
    throw new Error('failed to get events list')
  }
}
