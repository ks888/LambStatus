import EventUpdatesStore from 'db/eventUpdates'
import { MaintenanceUpdate } from 'model/maintenances'
import { MaintenanceUpdateTable } from 'utils/const'
import generateID from 'utils/generateID'

export default class MaintenanceUpdatesStore extends EventUpdatesStore {
  getTableName () {
    return MaintenanceUpdateTable
  }

  getPartitionKeyName () {
    return 'maintenanceID'
  }

  getSortKeyName () {
    return 'maintenanceUpdateID'
  }

  getAttributeNamesExceptKeys () {
    return ['maintenanceStatus', 'message', 'createdAt', 'updatedAt']
  }

  createEventUpdate (item) {
    if (!item.hasOwnProperty('createdAt')) {
      item.createdAt = item.updatedAt  // for backward compatibility
    }
    return new MaintenanceUpdate(item)
  }

  setUpdateID (item) {
    item.setMaintenanceUpdateID(generateID())
  }
}
