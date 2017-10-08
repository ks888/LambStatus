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
    return ['maintenanceStatus', 'message', 'updatedAt']
  }

  createEventUpdate (item) {
    return new MaintenanceUpdate(item)
  }

  setUpdateID (item) {
    item.setMaintenanceUpdateID(generateID())
  }
}
