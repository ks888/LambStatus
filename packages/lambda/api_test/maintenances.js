import assert from 'assert'
import fetch from 'node-fetch'
import { maintenanceStatuses } from 'utils/const'
import { urlPrefix, headers } from './utils'

export const v0GetMaintenances = async () => {
  const url = `${urlPrefix}/api/v0/maintenances`
  const response = await fetch(url, {headers})
  const body = await response.json()
  return {response, body}
}

export const v0PostMaintenances = async ({
  name = 'I1', status = maintenanceStatuses[0], message = '',
  startAt = '2018-04-21T07:15:50.634Z', endAt = '2018-04-21T07:15:50.634Z'
} = {}) => {
  const url = `${urlPrefix}/api/v0/maintenances`
  const reqbody = {name, status, message, startAt, endAt}
  const response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(reqbody)})
  const body = await response.json()
  return {response, body}
}

export const v0GetMaintenance = async (maintenanceID) => {
  const url = `${urlPrefix}/api/v0/maintenances/${maintenanceID}`
  const response = await fetch(url, {headers})
  const body = await response.json()
  return {response, body}
}

export const v0PatchMaintenances = async (maintenanceID, maintenance) => {
  const url = `${urlPrefix}/api/v0/maintenances/${maintenanceID}`
  const response = await fetch(url, {method: 'PATCH', headers, body: JSON.stringify(maintenance)})
  const body = await response.json()
  return {response, body}
}

export const v0DeleteMaintenance = async (maintenanceID) => {
  const url = `${urlPrefix}/api/v0/maintenances/${maintenanceID}`
  const response = await fetch(url, {method: 'DELETE', headers})
  return {response}
}

describe('V0Maintenances', () => {
  before(async () => {
    const {body} = await v0GetMaintenances()
    await Promise.all(body.map(async (maintenance) => {
      await v0DeleteMaintenance(maintenance.maintenanceID)
    }))
  })

  describe('Get Maintenances', () => {
    it('should return the list of maintenances', async () => {
      await v0PostMaintenances()

      const {response, body} = await v0GetMaintenances()
      assert(response.status === 200)
      assert(body.length === 1)
      assert(body[0].maintenanceID !== '')
    })
  })

  describe('Get Maintenance', () => {
    it('should return one maintenance', async () => {
      const {body: maintenance} = await v0PostMaintenances()

      const {response, body} = await v0GetMaintenance(maintenance.maintenanceID)
      assert(response.status === 200)
      assert(body.maintenanceID === maintenance.maintenanceID)
      assert(body.maintenanceUpdates.length === maintenance.maintenanceUpdates.length)
      assert(body.maintenanceUpdates[0].maintenanceUpdateID === maintenance.maintenanceUpdates[0].maintenanceUpdateID)
    })
  })

  describe('Post', () => {
    it('should create a new maintenance', async () => {
      const {response, body} = await v0PostMaintenances()
      assert(response.status === 200)
      assert(body.maintenanceID !== '')
      assert(body.maintenanceUpdates.maintenanceUpdateID !== '')
      assert(body.components === undefined)
    })

    it('should return validation error if invalid param', async () => {
      const {response, body} = await v0PostMaintenances({name: ''})
      assert(response.status === 400)
      assert(body.errors.length === 1)
      assert(body.errors[0].message.match(/valid/))
    })
  })

  describe('Patch', () => {
    it('should update the existing maintenance', async () => {
      const {body: maintenance} = await v0PostMaintenances()
      const {response, body} = await v0PatchMaintenances(maintenance.maintenanceID, {name: 'I2'})

      assert(response.status === 200)
      assert(body.name === 'I2')
      assert(body.status === maintenance.status)
      assert(body.updatedAt !== maintenance.updatedAt)
      assert(body.maintenanceUpdates.length === maintenance.maintenanceUpdates.length + 1)
      assert(body.components === undefined)
    })

    it('should return not found error if id not found', async () => {
      const {response, body} = await v0PatchMaintenances('1')

      assert(response.status === 400)
      assert(body.errors.length === 1)
      assert(body.errors[0].message.match(/not found/))
    })

    it('should return validation error if invalid param', async () => {
      const {body: maintenance} = await v0PostMaintenances()
      const {response, body} = await v0PatchMaintenances(maintenance.maintenanceID, {name: ''})

      assert(response.status === 400)
      assert(body.errors.length === 1)
      assert(body.errors[0].message.match(/valid/))
    })
  })

  describe('Delete', () => {
    it('should delete the existing maintenance', async () => {
      const {body} = await v0PostMaintenances()
      const {response} = await v0DeleteMaintenance(body.maintenanceID)

      assert(response.status === 204)
    })

    it('should return no error even if the maintenance doesn\'t exist', async () => {
      const {response} = await v0DeleteMaintenance('1')
      assert(response.status === 204)
    })
  })
})
