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
    return ['name', 'status', 'updatedAt']
  }

  createEvent (item) {
    return new Incident(item)
  }

  setID (item) {
    item.setIncidentID(generateID())
  }
}
