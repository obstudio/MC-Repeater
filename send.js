const https = require('https')
const crypto = require('crypto')
const config = require('./config')

function send(info) {
  const msg = info.message
  if (msg) {
    // const msgShort = msg.length > 20 ? msg.slice(0, 10) + msg.length + msg.slice(-10) : msg
    // const salt = crypto.randomBytes(4).toString('hex')
    // const sign = crypto.createHash('md5').update(config.channelId + msgShort + salt + config.key).digest('hex')
    // const path = `/subscribe/${config.channelId}?salt=${salt}&sign=${sign}&msg=${encodeURIComponent(msg)}`
    // const options = {
    //   hostname: config.botServerHost,
    //   path: path,
    // }
    // https.get(options, (res) => {
    //   const { statusCode } = res
    //   if (statusCode !== 200) console.log('Request sending failed')
    // })
    console.log(msg)
  }
}

module.exports = send
