import AWS from 'aws-sdk'

export default class SES {
  constructor (region, sourceAddress) {
    this.ses = new AWS.SES({ apiVersion: '2010-12-01', region })
    this.sourceAddress = sourceAddress
    this.numRetries = 3
  }

  async sendEmailWithRetry (toAddress, title, body) {
    let lastErr
    for (let i = 0; i < this.numRetries; i++) {
      try {
        return await this.sendEmail(toAddress, title, body)
      } catch (err) {
        lastErr = err
      }
    }
    throw lastErr
  }

  async sendEmail (toAddress, title, body) {
    const params = {
      Destination: {
        ToAddresses: [toAddress]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: title
        }
      },
      Source: this.sourceAddress
    }

    return new Promise((resolve, reject) => {
      this.ses.sendEmail(params, (error, data) => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  }
}
