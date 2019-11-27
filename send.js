const https = require('https')
const crypto = require('crypto')
const config = require('./config')

function send(info) {
  switch (config.botType.trim().toLowerCase()) {
    case 'koishi':
    default:
      return sendKoishi(info)
  }
}

function sendKoishi(info) {
  const msg = info.message
  if (msg) {
    const msgShort = msg.length > 20 ? msg.slice(0, 10) + msg.length + msg.slice(-10) : msg
    const salt = crypto.randomBytes(4).toString('hex')
    const sign = crypto.createHash('md5').update(config.channelId + msgShort + salt + config.key).digest('hex')
    const path = `${config.botPath}?salt=${salt}&sign=${sign}&msg=${encodeURIComponent(msg)}`
    const options = {
      hostname: config.botHost,
      path: path,
    }
    https.get(options, (res) => {
      const { statusCode } = res
      if (statusCode !== 200) console.log('Request sending failed')
    })
  }
}

module.exports = send
