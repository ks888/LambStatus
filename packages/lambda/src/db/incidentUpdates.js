import EventUpdatesStore from 'db/eventUpdates'
import { IncidentUpdate } from 'model/incidents'
import { IncidentUpdateTable } from 'utils/const'
import generateID from 'utils/generateID'

export default class IncidentUpdatesStore extends EventUpdatesStore {
  getTableName () {
    return IncidentUpdateTable
  }

  getPartitionKeyName () {
    return 'incidentID'
  }

  getSortKeyName () {
    return 'incidentUpdateID'
  }

  getAttributeNamesExceptKeys () {
    return ['incidentStatus', 'message', 'createdAt', 'updatedAt']
  }

  createEventUpdate (item) {
    if (!item.hasOwnProperty('createdAt')) {
      item.createdAt = item.updatedAt  // for backward compatibility
    }
    return new IncidentUpdate(item)
  }

  setUpdateID (item) {
    item.setIncidentUpdateID(generateID())
  }
}
