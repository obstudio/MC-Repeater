const https = require('https')
const config = require('./config.json')

function send(info) {
  const options = {
    hostname: config.botServerHost,
    path: `/subscribe?channel=ob-server&type=${info['type']}&message=${info['message']}`,
  }
  https.get(options, (res) => {
    const { statusCode } = res

  })
}

module.exports = send