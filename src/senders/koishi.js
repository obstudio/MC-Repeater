const https = require('https')
const crypto = require('crypto')

function sender(msg, config) {
  const msgShort = msg.length > 20 ? msg.slice(0, 10) + msg.length + msg.slice(-10) : msg
  const salt = crypto.randomBytes(4).toString('hex')
  const sign = crypto.createHmac('sha1', config.key).update(msgShort + salt).digest('hex')
  const path = `/webhook/channel/${config.channel}?salt=${salt}&sign=${sign}&msg=${encodeURIComponent(msg)}`
  const options = {
    hostname: config.botHost,
    path: path
  }
  return new Promise((resolve, reject) => {
    https.get(options, (response) => {
      const { statusCode } = response
      if (statusCode !== 200) reject('Request sending failed')
      resolve()
    })
  })
}

module.exports = sender
