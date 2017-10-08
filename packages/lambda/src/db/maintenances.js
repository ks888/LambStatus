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
    return ['name', 'status', 'startAt', 'endAt', 'updatedAt']
  }

  createEvent (item) {
    return new Maintenance(item)
  }

  setID (item) {
    item.setMaintenanceID(generateID())
  }
}
