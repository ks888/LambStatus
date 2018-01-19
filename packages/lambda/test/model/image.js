import assert from 'assert'
import { RetinaImage, NormalImage, Image, getMimeTypeFromDataURL } from 'model/image'

// eslint-disable-next-line
const dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII='

describe('Image', () => {
  describe('constructor', () => {
    it('create Image instance', (done) => {
      const actual = new Image(dataURL)
      assert(actual instanceof Image)
      actual.image.size((err, value) => {
        assert(err === undefined)
        assert(value.width === 1)
        assert(value.height === 1)
        done()
      })
    })
  })

  describe('getMimeTypeFromDataURL', () => {
    it('return type if supported', () => {
      const actual = getMimeTypeFromDataURL(dataURL)
      assert(actual === 'image/png')
    })

    it('throw error when type is not supported', () => {
      let err
      try {
        getMimeTypeFromDataURL('data:text/plain')
      } catch (e) { err = e }
      assert(err !== undefined)
    })
  })

  describe('resizeByHeight', () => {
    it('resize image', () => {
      const image = new Image(dataURL)
      image.resizeByHeight(2)

      assert.deepEqual(['-resize', 'x2'], image.image._out)
    })
  })

  describe('toBuffer', () => {
    it('returns Buffer object', async () => {
      const actual = new Image(dataURL)
      const buffer = await actual.toBuffer()
      assert(buffer instanceof Buffer)
    })
  })
})

describe('RetinaImage', () => {
  describe('constructor', () => {
    it('create RetinaImage instance', () => {
      const actual = new RetinaImage(dataURL)
      assert(actual instanceof Image)
      assert(actual.height === 280)
      assert.deepEqual(['-resize', 'x280'], actual.image._out)
    })
  })
})

describe('NormalImage', () => {
  describe('constructor', () => {
    it('create NormalImage instance', () => {
      const actual = new NormalImage(dataURL)
      assert(actual instanceof Image)
      assert(actual.height === 140)
      assert.deepEqual(['-resize', 'x140'], actual.image._out)
    })
  })
})
