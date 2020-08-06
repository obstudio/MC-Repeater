senders = {}
senders['local'] = require('./local')
senders['koishi'] = require('./koishi')
senders['zulip'] = require('./zulip')

module.exports = senders
