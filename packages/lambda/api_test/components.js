import assert from 'assert'
import { v0GetComponents, v0PostComponents, v0PatchComponents, v0DeleteComponent } from './apis'

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
