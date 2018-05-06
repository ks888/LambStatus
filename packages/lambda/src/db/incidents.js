import EventsStore from 'db/events'
import { Incident } from 'model/incidents'
import { IncidentTable } from 'utils/const'
import generateID from 'utils/generateID'

export default class IncidentsStore extends EventsStore {
  getTableName () {
    return IncidentTable
  }

  getPartitionKeyName () {
    return 'incidentID'
  }

  getAttributeNamesExceptKeys () {
    return ['name', 'status', 'createdAt', 'updatedAt']
  }

  createEvent (item) {
    if (!item.hasOwnProperty('createdAt')) {
      item.createdAt = item.updatedAt  // for backward compatibility
    }
    return new Incident(item)
  }

  setID (item) {
    item.setEventID(generateID())
  }
}
