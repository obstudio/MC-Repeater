const config = require('./config.json')

function parse(text) {
  switch (config.serverType) {
    case 'java':
      return parseJava(text)
  }
}

function parseJava(text) {
  const reg = /\[\d{2}:\d{2}:\d{2}\] \[Server thread\/INFO\]: (.*)/
  res = reg.exec(text)
  if (!res) return

  text = res[1]
  const regJoin = /\w+ joined the game/
  const regLeave = /\w+ left the game/
  const regStart = /Done \([0-9\.]+s\)! For help, type "help"/
  const regStop = /Stopping the server/
  info = undefined
  if (regJoin.exec(text)) {
    info = {
      'type': 'join',
      'message': text
    }
  } else if (regLeave.exec(text)) {
    info = {
      'type': 'leave',
      'message': text
    }
  } else if (regStart.exec(text)) {
    info = {
      'type': 'start',
      'message': 'Server started'
    }
  } else if (regStop.exec(text)) {
    info = {
      'type': 'stop',
      'message': 'Server stopped'
    }
  }
  return info
}

module.exports = parse