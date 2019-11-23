const https = require('https')
const crypto = require('crypto')
const config = require('./config.json')

function send(info) {
  const msg = info['message']
  if (msg) {
    const msgShort = msg.length > 20 ? msg.slice(0, 10) + msg.length + msg.slice(-10) : msg
    const sign = crypto.createHash('md5').update(config.id + msgShort + salt + config.key).digest('hex')
    const options = {
      hostname: config.botServerHost,
      path: `/subscribe/:${config.id}?salt=${salt}&sign=${sign}&msg=${msg}`,
    }
    https.get(options, (res) => {
      const { statusCode } = res
      if (statusCode !== 200) console.log('Request sending failed')
    })
  }
}

module.exports = send