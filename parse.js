const config = require('./config.json')
const i18n = require('./i18n.json')

const lang = i18n[config['language']]

function parse(text) {
  switch (config.serverType) {
    case 'java':
      return parseJava(text)
  }
}

function parseJava(text) {
  const reg = /^\[\d{2}:\d{2}:\d{2}\] \[Server thread\/INFO\]: (.*)$/
  res = reg.exec(text)
  if (!res) return

  text = res[1]
  const regJoin = /^(\w+) joined the game$/
  const regLeave = /^(\w+) left the game$/
  const regStart = /^Done \([0-9\.]+s\)! For help, type "help"$/
  const regStop = /^Stopping the server$/
  const regMsg = /^<(\w+)> (.+)$/
  info = undefined
  if (res = regJoin.exec(text)) {
    info = {
      'message': res[1] + ' ' + lang['join']
    }
  } else if (res = regLeave.exec(text)) {
    info = {
      'message': res[1] + ' ' + lang['leave']
    }
  } else if (regStart.exec(text)) {
    info = {
      'message': lang['start']
    }
  } else if (regStop.exec(text)) {
    info = {
      'message': lang['stop']
    }
  } else if (res = regMsg.exec(text)) {
    info = {
      'message': res[1] + ': ' + res[2]
    }
  }
  return info
}

module.exports = parse