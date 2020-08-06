const Zulip = require('zulip-js')

function sender(msg, config) {
  let zulipConfig = {
    username: config.botName,
    apiKey: config.key,
    realm: `https://${config.botHost}/`,
  }
  let [stream, topic] = config.channel.split('/')
  let params = {
    to: stream,
    type: 'stream',
    topic: topic,
    content: msg
  }
  Zulip(zulipConfig).then(async (client) => {
    return await client.messages.send(params)
  }).then(console.log).catch(console.err)
}

module.exports = sender
