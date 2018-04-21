import assert from 'assert'
import fetch from 'node-fetch'
import { componentStatuses } from 'utils/const'
import { urlPrefix, headers } from './utils'

export const v0GetComponents = async () => {
  const url = `${urlPrefix}/api/v0/components`
  const response = await fetch(url, {headers})
  const body = await response.json()
  return {response, body}
}

export const v0PostComponents = async ({name = 'C1', description = '', status = componentStatuses[0]} = {}) => {
  const url = `${urlPrefix}/api/v0/components`
  const reqbody = {name, description, status}
  const response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(reqbody)})
  const body = await response.json()
  return {response, body}
}

export const v0PatchComponents = async (componentID, component) => {
  const url = `${urlPrefix}/api/v0/components/${componentID}`
  const response = await fetch(url, {method: 'PATCH', headers, body: JSON.stringify(component)})
  const body = await response.json()
  return {response, body}
}

export const v0DeleteComponent = async (componentID) => {
  const url = `${urlPrefix}/api/v0/components/${componentID}`
  const response = await fetch(url, {method: 'DELETE', headers})
  return {response}
}

describe('V0Components', () => {
  before(async () => {
    const {body} = await v0GetComponents()
    await Promise.all(body.map(async (component) => {
      await v0DeleteComponent(component.componentID)
    }))
  })

  describe('Get', () => {
    it('should return the list of components', async () => {
      const {response, body} = await v0GetComponents()
      assert(response.status === 200)
      assert(body.length === 0)
    })
  })

  describe('Post', () => {
    it('should create a new component', async () => {
      const {response, body} = await v0PostComponents()
      assert(response.status === 200)
      assert(body.componentID.length === 12)
    })

    it('should return validation error if invalid param', async () => {
      const {response, body} = await v0PostComponents({name: ''})
      assert(response.status === 400)
      assert(body.errors.length === 1)
      assert(body.errors[0].message.match(/valid/))
    })
  })

  describe('Patch', () => {
    it('should update the existing component', async () => {
      const postResult = await v0PostComponents()
      postResult.body.name = 'C2'
      const {response, body} = await v0PatchComponents(postResult.body.componentID, {name: 'C2'})

      assert(response.status === 200)
      assert(body.name === 'C2')
      assert(body.status === postResult.body.status)
    })

    it('should return validation error if invalid param', async () => {
      const postResult = await v0PostComponents()
      const {response, body} = await v0PatchComponents(postResult.body.componentID, {name: ''})

      assert(response.status === 400)
      assert(body.errors.length === 1)
      assert(body.errors[0].message.match(/valid/))
    })
  })

  describe('Delete', () => {
    it('should delete the existing component', async () => {
      const {body} = await v0PostComponents()
      const {response} = await v0DeleteComponent(body.componentID)

      assert(response.status === 204)
    })

    it('should return no error even if the component doesn\'t exist', async () => {
      const {response} = await v0DeleteComponent(1)
      assert(response.status === 204)
    })
  })
})
