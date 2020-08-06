const process = require('process')
const config = require(process.cwd() + '/config')
const senders = require('./senders')

let bufferMessage = ''
let lastTimestamp = 0

const THROTTLE_INTERVAL = (config.throttleInterval || 0) * 1000

async function send(message) {
  bufferMessage = bufferMessage ? `${bufferMessage}\n${message}` : message
  const timestamp = Date.now()
  if (timestamp - lastTimestamp > THROTTLE_INTERVAL) {
    return sendBuffer()
  } else if (THROTTLE_INTERVAL) {
    return timeout = setTimeout(sendBuffer, THROTTLE_INTERVAL)
  }
}

async function sendBuffer() {
  for (bot in config.bots) {
    let botType = (bot.botType || 'local').toLowerCase()
    await senders[botType](bufferMessage, bot)
  }
  bufferMessage = ''
  lastTimestamp = Date.now()
}

module.exports = send
