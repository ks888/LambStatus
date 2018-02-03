import assert from 'assert'
import { generateEmailMessage, generateEmailSubject, buildConfirmURL } from 'api/generateVerificationMessage'

describe('generateVerificationMessage', () => {
  describe('generateEmailMessage', () => {
    it('should include service name and url', async () => {
      const serviceName = 'name'
      const url = 'https://example.com'
      const msg = generateEmailMessage(serviceName, url)
      assert(msg.includes(serviceName))
      assert(msg.includes(url))
    })
  })

  describe('generateEmailSubject', () => {
    it('should include service name', async () => {
      const serviceName = 'name'
      const msg = generateEmailSubject(serviceName)
      assert(msg.includes(serviceName))
    })
  })

  describe('buildConfirmURL', () => {
    it('should append the query parameter', async () => {
      const url = 'https://example.com'
      const clientID = '100'
      const code = '200'
      const username = '300'
      const expect = `${url}/api/subscribers/confirm?clientID=${clientID}&username=${username}&code=${code}`
      const actual = buildConfirmURL(url, clientID, code, username)
      assert(actual === expect)
    })
  })
})
