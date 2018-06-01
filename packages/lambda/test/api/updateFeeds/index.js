import assert from 'assert'
import sinon from 'sinon'
import {
  handle, latestCreatedAtToOldest, latestDateToOldest, buildFeed, buildIncidentItems, buildMaintenanceItems, buildItem
} from 'api/updateFeeds'
import { SettingsProxy } from 'api/utils'
import S3 from 'aws/s3'
import CloudFormation from 'aws/cloudFormation'
import IncidentUpdatesStore from 'db/incidentUpdates'
import IncidentsStore from 'db/incidents'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import MaintenancesStore from 'db/maintenances'
import { Incident, IncidentUpdate } from 'model/incidents'
import { Maintenance } from 'model/maintenances'

describe('updateFeeds', () => {
  const serviceName = 'Test'
  const statusPageURL = 'https://xxx.cloudfront.net'
  const event = new Incident({incidentID: 1, name: 'test', createdAt: '2018-01-01T00:00:00.000Z'})
  const events = [event]
  const eventUpds = [
    new IncidentUpdate({incidentStatus: 'Investigating', createdAt: '2018-01-01T00:00:00.000Z', message: 'test'})
  ]
  let queryIncidentsStoreStub, queryMaintenancesStoreStub

  beforeEach(() => {
    sinon.stub(IncidentUpdatesStore.prototype, 'query').returns(eventUpds)
    queryIncidentsStoreStub = sinon.stub(IncidentsStore.prototype, 'query').returns(events)

    sinon.stub(MaintenanceUpdatesStore.prototype, 'query').returns(eventUpds)
    queryMaintenancesStoreStub = sinon.stub(MaintenancesStore.prototype, 'query').returns(events)
  })

  afterEach(() => {
    IncidentUpdatesStore.prototype.query.restore()
    IncidentsStore.prototype.query.restore()

    MaintenanceUpdatesStore.prototype.query.restore()
    MaintenancesStore.prototype.query.restore()
  })

  describe('handle', () => {
    let putObjectStub

    beforeEach(() => {
      sinon.stub(CloudFormation.prototype, 'getStatusPageCloudFrontURL').returns(statusPageURL)
      sinon.stub(CloudFormation.prototype, 'getStatusPageBucketName').returns('test')
      sinon.stub(SettingsProxy.prototype, 'getServiceName').returns(serviceName)
      putObjectStub = sinon.stub(S3.prototype, 'putObject')
    })

    afterEach(() => {
      CloudFormation.prototype.getStatusPageCloudFrontURL.restore()
      CloudFormation.prototype.getStatusPageBucketName.restore()
      SettingsProxy.prototype.getServiceName.restore()
      S3.prototype.putObject.restore()
    })

    it('should put the feeds to s3 bucket', async () => {
      await handle(undefined, undefined, () => {})
      console.log(putObjectStub.secondCall.args)
      assert(putObjectStub.callCount === 2)
      assert(putObjectStub.firstCall.args[2] === 'history.atom')
      assert(putObjectStub.firstCall.args[6] === 'public-read')
      assert(putObjectStub.secondCall.args[2] === 'history.rss')
      assert(putObjectStub.secondCall.args[6] === 'public-read')
    })
  })

  describe('buildFeed', () => {
    it('should build the feed', async () => {
      const feed = await buildFeed(serviceName, statusPageURL)
      assert(feed.options.id === 'tag:https://xxx.cloudfront.net,2017:/history')
      assert(feed.options.link === statusPageURL)
      assert(feed.options.title === '[Test Status] Incident History')
      assert(feed.options.author.name === serviceName)
    })

    it('should add items', async () => {
      const feed = await buildFeed(serviceName, statusPageURL)
      assert(feed.items.length === events.length * 2)
    })
  })

  describe('latestDateToOldest', () => {
    it('should sort the event by date', () => {
      const events = [
        {id: 1, date: new Date(2018, 0, 1)},
        {id: 2, date: new Date(2018, 0, 3)},
        {id: 3, date: new Date(2018, 0, 2)}
      ]
      events.sort(latestDateToOldest)

      assert(events[0].id === 2)
      assert(events[1].id === 3)
      assert(events[2].id === 1)
    })
  })

  describe('buildIncidentItems', () => {
    it('should build the feed items which represents the incidents', async () => {
      const items = await buildIncidentItems(statusPageURL)
      assert(items.length === events.length)
    })

    it('should build the at most 25 feed items', async () => {
      const events = []
      for (let i = 0; i < 30; i++) { events.push(event) }
      queryIncidentsStoreStub.returns(events)

      const items = await buildIncidentItems(statusPageURL)
      assert(items.length === 25)
    })
  })

  describe('buildMaintenanceItems', () => {
    it('should build the feed items which represents the maintenance', async () => {
      const events = [new Maintenance({maintenanceID: 1, name: 'test', createdAt: '2018-01-01T00:00:00.000Z'})]
      queryMaintenancesStoreStub.returns(events)
      const items = await buildMaintenanceItems(statusPageURL)
      assert(items.length === events.length)
    })

    it('should build the at most 25 feed items', async () => {
      const events = []
      for (let i = 0; i < 30; i++) { events.push(event) }
      queryMaintenancesStoreStub.returns(events)

      const items = await buildMaintenanceItems(statusPageURL)
      assert(items.length === 25)
    })
  })

  describe('latestCreatedAtToOldest', () => {
    it('should sort the event by createdAt', () => {
      const events = [
        new Incident({incidentID: 1, createdAt: '2018-01-01T00:00:00.000Z'}),
        new Incident({incidentID: 2, createdAt: '2018-01-03T00:00:00.000Z'}),
        new Incident({incidentID: 3, createdAt: '2018-01-02T00:00:00.000Z'})
      ]
      events.sort(latestCreatedAtToOldest)

      assert(events[0].getEventID() === 2)
      assert(events[1].getEventID() === 3)
      assert(events[2].getEventID() === 1)
    })
  })

  describe('buildItem', () => {
    it('should build the feed item which represents the one incident and its updates', async () => {
      const item = await buildItem(event, new IncidentUpdatesStore(), statusPageURL)

      assert(item.id === `tag:https://xxx.cloudfront.net,2017:Incident/1`)
      assert(item.link === `https://xxx.cloudfront.net/incidents/1`)
      assert(item.content === `<p><small>Jan 1, 2018, 00:00 UTC</small><br><strong>Investigating</strong> - test</p>`)
      assert(item.published.toISOString() === eventUpds[0].createdAt)
      assert(item.date.toISOString() === event.createdAt)
      assert(item.title === event.name)
    })
  })
})
