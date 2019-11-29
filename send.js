const https = require('https')
const crypto = require('crypto')
const config = require('./config')

let bufferMessage = ''
let lastTimestamp = 0

const BOT_TYPE = (config.botType || 'koishi').toLowerCase()
const THROTTLE_INTERVAL = (config.throttleInterval || 0) * 1000

async function send (message) {
  bufferMessage = bufferMessage ? `${bufferMessage}\n${message}` : message
  const timestamp = Date.now()
  if (timestamp - lastTimestamp > THROTTLE_INTERVAL) {
    return sendBuffer()
  } else if (THROTTLE_INTERVAL) {
    return timeout = setTimeout(sendBuffer, THROTTLE_INTERVAL)
  }
}

async function sendBuffer () {
  await builtinSenders[BOT_TYPE](bufferMessage)
  bufferMessage = ''
  lastTimestamp = timestamp
}

const builtinSenders = {
  koishi (msg) {
    const msgShort = msg.length > 20 ? msg.slice(0, 10) + msg.length + msg.slice(-10) : msg
    const salt = crypto.randomBytes(4).toString('hex')
    const sign = crypto.createHmac('sha1', config.key).update(msgShort + salt).digest('hex')
    const path = `${config.botPath}?salt=${salt}&sign=${sign}&msg=${encodeURIComponent(msg)}`
    const options = {
      hostname: config.botHost,
      path: path,
    }
    return new Promise((resolve, reject) => {
      https.get(options, (response) => {
        const { statusCode } = response
        if (statusCode !== 200) reject('Request sending failed')
        resolve()
      })
    })
  },
}

module.exports = send
