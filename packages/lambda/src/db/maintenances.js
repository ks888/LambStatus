import EventsStore from 'db/events'
import { Maintenance } from 'model/maintenances'
import { MaintenanceTable } from 'utils/const'
import generateID from 'utils/generateID'

export default class MaintenanceStore extends EventsStore {
  getTableName () {
    return MaintenanceTable
  }

  getPartitionKeyName () {
    return 'maintenanceID'
  }

  getAttributeNamesExceptKeys () {
    return ['name', 'status', 'startAt', 'endAt', 'createdAt', 'updatedAt']
  }

  createEvent (item) {
    if (!item.hasOwnProperty('createdAt')) {
      item.createdAt = item.updatedAt  // for backward compatibility
    }
    return new Maintenance(item)
  }

  setID (item) {
    item.setID(generateID())
  }
}
