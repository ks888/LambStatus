import gmOrg from 'gm'
const gm = gmOrg.subClass({ imageMagick: true })

const expectedHeight = 140  // px
const supportedTypes = [
  {mime: 'image/png', ext: 'png'},
  {mime: 'image/jpeg', ext: 'jpg'}
]

export const getMimeTypeFromDataURL = (dataURL) => {
  for (let i = 0; i < supportedTypes.length; i++) {
    if (dataURL.startsWith(`data:${supportedTypes[i].mime}`)) {
      return supportedTypes[i].mime
    }
  }
  throw new Error('unsupported mime type')
}

export class Image {
  constructor (dataURL) {
    this.mimeType = getMimeTypeFromDataURL(dataURL)

    const rawData = dataURL.replace(`data:${this.mimeType};base64,`, '')
    this.image = gm(Buffer.from(rawData, 'base64'))
  }

  // resizeByHeight changes the height setting of the image.
  // Note that gm does resize the image on writing out.
  // Just calling resize function does not change the image data.
  resizeByHeight (height) {
    this.image.resize(null, height)
  }

  toBuffer () {
    return new Promise((resolve, reject) => {
      this.image.toBuffer((err, buffer) => {
        if (err) {
          return reject(err)
        }
        resolve(buffer)
      })
    })
  }

  extension () {
    for (let i = 0; i < supportedTypes.length; i++) {
      if (supportedTypes[i].mime === this.mimeType) return supportedTypes[i].ext
    }
    throw new Error('unsupported mime type')
  }
}

export class RetinaImage extends Image {
  constructor (dataURL) {
    super(dataURL)
    this.height = expectedHeight * this.devicePixelRatio()
    this.resizeByHeight(this.height)
  }

  devicePixelRatio () {
    return 2
  }

  suffixForImageName () {
    return `@2x`
  }
}

export class NormalImage extends Image {
  constructor (dataURL) {
    super(dataURL)
    this.height = expectedHeight * this.devicePixelRatio()
    this.resizeByHeight(this.height)
  }

  devicePixelRatio () {
    return 1
  }

  suffixForImageName () {
    return ''
  }
}
