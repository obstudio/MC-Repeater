const config = require('./config')
const locale = require('./locale')

const lang = locale[config.language.trim().toLowerCase()]

const vchar = '[^\\s\\$:;<>\\[\\]\\(\\)\\-\\,\\.\\{\\}+=*!?/\\\\|`~@#%^&\'"]'
const mob = `${vchar}+(?: [A-Z][a-z]*)?`

function parse(text) {
  switch (config.serverType.trim().toLowerCase()) {
    case 'java':
      return parseJava(text)
    case 'paper':
    case 'paperspigot':
      return parsePaper(text)
  }
}

function translate(formatted, args) {
  const res = formatted.match(/\$\d+/g)
  if (res) {
    res.forEach(flag => {
      const index = +flag.substring(1)
      formatted = formatted.replace(flag, args[index])
    })
  }
  return formatted
}

function mobName(name) {
  return lang.mobs[name] || name
}

function parseDeath (text) {
  const regDeath = new RegExp(`^(${vchar}+) (.+)$`)
  let result = regDeath.exec(text)
  if (!result) return null
  
  let victim = result[1]
  let reason = result[2]
  let args = []

  let reasonResult
  if (reasonResult = (new RegExp(`^was shot by (${mob})(?: using (.+))?$`)).exec(reason)) {
    if (reasonResult[2]) {
      args.push(mobName(reasonResult[1]))
      args.push(reasonResult[2])
      reason = 'arrow-mob-weapon'
    } else if (reasonResult[1] !== 'Arrow') {
      args.push(mobName(reasonResult[1]))
      reason = 'arrow-mob'
    } else {
      reason = 'arrow'
    }
  } else if (reason === 'was pricked to death') {
    reason = 'cactus'
  } else if (reasonResult = (new RegExp(`^walked into a cactus whilst trying to escape (${mob})$`)).exec(reason)) {
    args.push(reasonResult[1])
    reason = 'cactus-mob'
  } else if (reasonResult = (new RegExp(`^was roasted in dragon breath(?: by (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'breath-mob'
    } else {
      reason = 'breath'
    }
  } else if (reasonResult = (new RegExp(`^drowned(?: whilst trying to escape (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'drown-mob'
    } else {
      reason = 'drown'
    }
  } else if (reasonResult = (new RegExp(`^suffocated in a wall(?: whilst fighting (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'suffocate-mob'
    } else {
      reason = 'suffocate'
    }
  } else if (reason === 'was squished too much') {
    reason = 'squash'
  } else if (reasonResult = (new RegExp(`^was squashed by (${mob})$`)).exec(reason)) {
    args.push(mobName(reasonResult[1]))
    reason = 'squash-mob'
  } else if (reasonResult = (new RegExp(`^experienced kinetic energy(?: whilst trying to escape (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'aircrash-mob'
    } else {
      reason = 'aircrash'
    }
  } else if (reasonResult = (new RegExp(`^removed an elytra while flying whilst trying to escape (${mob})$`)).exec(reason)) {
    args.push(mobName(reasonResult[1]))
    reason = 'wingless-mob'
  } else if (reason === 'blew up') {
    reason = 'explode'
  } else if (reasonResult = (new RegExp(`^was blown up by (${mob})(?: using (.+))?$`)).exec(reason)) {
    if (reasonResult[2]) {
      args.push(mobName(reasonResult[1]))
      args.push(reasonResult[2])
      reason = 'explode-mob-weapon'
    } else {
      args.push(mobName(reasonResult[1]))
      reason = 'explode-mob'
    }
  } else if (reason === 'was killed by [Intentional Game Design]‌') {
    reason = 'bedbomb'
  } else if (reasonResult = (new RegExp(`^hit the ground too hard(?: whilst trying to escape (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'fall-mob'
    } else {
      reason = 'fall'
    }
  } else if (reason === 'fell from a high place') {
    reason = 'highfall'
  } else if (reason === 'fell off a ladder') {
    reason = 'ladderfall'
  } else if (reason === 'fell off some vines') {
    reason = 'vinefall'
  } else if (reason === 'fell out of the water') {
    reason = 'waterfall'
  } else if (reason === 'fell into a patch of fire') {
    reason = 'firedrop'
  } else if (reason === 'fell into a patch of cacti') {
    reason = 'cactusdrop'
  } else if (reasonResult = (new RegExp(`^was doomed to fall(?: by (${mob})(?: using (.+))?)?$`)).exec(reason)) {
    if (reasonResult[2]) {
      args.push(mobName(reasonResult[1]))
      args.push(reasonResult[2])
      reason = 'doomfall-mob-weapon'
    } else if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'doomfall-mob'
    } else {
      reason = 'doomfall'
    }
  } else if (reasonResult = (new RegExp(`^fell too far and was finished by (${mob})(?: using (.+))?$`)).exec(reason)) {
    if (reasonResult[2]) {
      args.push(mobName(reasonResult[1]))
      args.push(reasonResult[2])
      reason = 'farfall-mob-weapon'
    } else {
      args.push(mobName(reasonResult[1]))
      reason = 'farfall-mob'
    }
  } else if (reasonResult = (new RegExp(`^was shot off some vines by (${mob})$`)).exec(reason)) {
    args.push(mobName(reasonResult[1]))
    reason = 'vineshot-mob'
  } else if (reasonResult = (new RegExp(`^was shot off a ladder by (${mob})$`)).exec(reason)) {
    args.push(mobName(reasonResult[1]))
    reason = 'laddershot-mob'
  } else if (reasonResult = (new RegExp(`^was blown from a high place by (${mob})$`)).exec(reason)) {
    args.push(mobName(reasonResult[1]))
    reason = 'blownoff-mob'
  } else if (reasonResult = (new RegExp(`^was squashed by a falling (?:anvil|block)(?: whilst fighting (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'fightsquash-mob'
    } else {
      reason = 'squash'
    }
  } else if (reason === 'went up in flames') {
    reason = 'selfburning'
  } else if (reasonResult = (new RegExp(`^walked into fire whilst fighting (${mob})$`)).exec(reason)) {
    args.push(mobName(reasonResult[1]))
    reason = 'selfburning-mob'
  } else if (reason === 'burned to death') {
    reason = 'burned'
  } else if (reasonResult = (new RegExp(`^was burnt to a crisp whilst fighting (${mob})$`)).exec(reason)) {
    args.push(mobName(reasonResult[1]))
    reason = 'burned-mob'
  } else if (reasonResult = (new RegExp(`^went off with a bang(?: whilst fighting (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'fireworks-mob'
    } else {
      reason = 'fireworks'
    }
  } else if (reasonResult = (new RegExp(`^tried to swim in lava(?: to escape (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'lava-mob'
    } else {
      reason = 'lava'
    }
  } else if (reasonResult = (new RegExp(`^was struck by lightning(?: whilst fighting (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'lightning-mob'
    } else {
      reason = 'lightning'
    }
  } else if (reason === 'discovered the floor was lava') {
    reason = 'magmablock'
  } else if (reasonResult = (new RegExp(`^walked into danger zone due to (${mob})$`)).exec(reason)) {
    args.push(mobName(reasonResult[1]))
    reason = 'magmablock-mob'
  } else if (reasonResult = (new RegExp(`^was slain by (${mob})(?: using (.+))?$`)).exec(reason)) {
    if (reasonResult[2]) {
      args.push(mobName(reasonResult[1]))
      args.push(reasonResult[2])
      reason = 'slain-mob-weapon'
    } else {
      args.push(mobName(reasonResult[1]))
      reason = 'slain-mob'
    }
  } else if (reasonResult = (new RegExp(`^got finished off by (${mob})(?: using (.+))?$`)).exec(reason)) {
    if (reasonResult[2]) {
      args.push(mobName(reasonResult[1]))
      args.push(reasonResult[2])
      reason = 'finished-mob-weapon'
    } else {
      args.push(mobName(reasonResult[1]))
      reason = 'finished-mob'
    }
  } else if (reasonResult = (new RegExp(`^was fireballed by (${mob})(?: using (.+))?$`)).exec(reason)) {
    if (reasonResult[2]) {
      args.push(mobName(reasonResult[1]))
      args.push(reasonResult[2])
      reason = 'fireball-mob-weapon'
    } else {
      args.push(mobName(reasonResult[1]))
      reason = 'fireball-mob'
    }
  } else if (reasonResult = (new RegExp(`^was killed by(?: even more| (${mob}) using)? magic$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'magic-mob'
    } else {
      reason = 'magic'
    }
  } else if (reasonResult = (new RegExp(`^starved to death(?: whilst fighting (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'starve-mob'
    } else {
      reason = 'starve'
    }
  } else if (reasonResult = (new RegExp(`^was poked to death by a sweet berry bush(?: whilst trying to escape (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'berry-mob'
    } else {
      reason = 'berry'
    }
  } else if (reasonResult = (new RegExp(`^was killed(?: by (.+))? trying to hurt (${mob})$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[2]))
      args.push(reasonResult[1])
      reason = 'thorn-mob-weapon'
    } else {
      args.push(mobName(reasonResult[2]))
      reason = 'thorn-mob'
    }
  } else if (reasonResult = (new RegExp(`^was impaled by (${mob})(?: using (.+))?$`)).exec(reason)) {
    if (reasonResult[2]) {
      args.push(mobName(reasonResult[1]))
      args.push(reasonResult[2])
      reason = 'trident-mob-weapon'
    } else {
      args.push(mobName(reasonResult[1]))
      reason = 'trident-mob'
    }
  } else if (reason.endsWith('fell out of the world')) {
    reason = 'fallout'
  } else if (reasonResult = (new RegExp(`^didn't want to live in the same world as (${mob})$`)).exec(reason)) {
    args.push(mobName(reasonResult[1]))
    reason = 'fallout-mob'
  } else if (reasonResult = (new RegExp(`^withered away(?: whilst fighting (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'wither-mob'
    } else {
      reason = 'wither'
    }
  } else if (reasonResult = (new RegExp(`^was pummeled by (${mob})(?: using (.+))?$`)).exec(reason)) {
    if (reasonResult[2]) {
      args.push(mobName(reasonResult[1]))
      args.push(reasonResult[2])
      reason = 'pummel-mob-weapon'
    } else {
      args.push(mobName(reasonResult[1]))
      reason = 'pummel-mob'
    }
  } else if (reasonResult = (new RegExp(`^died(?: because of (${mob}))?$`)).exec(reason)) {
    if (reasonResult[1]) {
      args.push(mobName(reasonResult[1]))
      reason = 'die-mob'
    } else {
      reason = 'die'
    }
  } else {
    return null
  }

  return [reason, victim, ...args]
}

function parseJava(text) {
  text = text.trim()

  const reg = /^\[\d{2}:\d{2}:\d{2}\] \[Server thread\/INFO\]: (.*)$/
  res = reg.exec(text)
  if (!res) return

  text = res[1]
  const regJoin = new RegExp(`^(${vchar}+) joined the game$`)
  const regLeave = new RegExp(`^(${vchar}+) left the game$`)
  const regStart = /^Done \([0-9\.]+s\)! For help, type "help"$/
  const regStop = /^Stopping the server$/
  const regMsg = new RegExp(`^<(${vchar}+)> (.+)$`)
  const regServerMsg = new RegExp(`^\\[(${vchar}+)\\] (.+)$`)
  const regAdvance = new RegExp(`^(${vchar}+) has (?:made the advancement|reached the goal|completed the challenge) \\[(.+)\\]$`)
  info = undefined
  if (res = regJoin.exec(text)) {
    info = {
      type: 'join',
      target: res[1],
      message: translate(lang.join, res)
    }
  } else if (res = regLeave.exec(text)) {
    info = {
      type: 'leave',
      target: res[1],
      message: translate(lang.leave, res)
    }
  } else if (regStart.exec(text)) {
    info = {
      type: 'start',
      message: lang.start
    }
  } else if (regStop.exec(text)) {
    info = {
      type: 'stop',
      message: lang.stop
    }
  } else if (res = regMsg.exec(text)) {
    info = {
      type: 'chat',
      message: translate(lang.msg, res)
    }
  } else if (res = regServerMsg.exec(text)) {
    if (res[1] === 'Server') {
      res[1] = lang.server
    }
    info = {
      type: 'server',
      message: translate(lang.msg, res)
    }
  } else if (res = regAdvance.exec(text)) {
    res[2] = lang.advancements[res[2]]
    info = {
      type: 'advance',
      message: translate(lang.makeAdvance, res)
    }
  } else if (res = parseDeath(text)) {
    info = {
      type: 'death',
      message: translate(lang.deathReasons[res[0]], res)
    }
  }
  return info
}

function parsePaper(text) {
  text = text.trim()

  let info

  const serverInfo = /^\[\d{2}:\d{2}:\d{2} INFO\]: (.+)$/
  let serverInfoResult = serverInfo.exec(text)

  const chatInfo = /^\[\d{2}:\d{2}:\d{2}\] \[Async Chat Thread - #\d+\/INFO\]: (.+)$/
  let chatInfoResult = chatInfo.exec(text)

  if (serverInfoResult) {
    text = serverInfoResult[1]
    const regJoin = new RegExp(`^(${vchar}+)\\[\\/\\d{1,3}(\\.\\d{1,3}){3}:\\d+\\] logged in with entity id -?\\d+ at \\(\\[${vchar}+\\]-?\\d+\\.\\d+, -?\\d+\\.\\d+, -?\\d+\\.\\d+\\)$`)
    const regLeave = new RegExp(`^(${vchar}+) left the game$`)
    const regStart = /^Done \([0-9\.]+s\)! For help, type "help"$/
    const regStop = /^Stopping server$/
    const regServerMsg = new RegExp(`^\\[(${vchar}+)\\] (.+)$`)
    const regAdvance = new RegExp(`^(${vchar}+) has (?:made the advancement|reached the goal|completed the challenge) \\[(.+)\\]$`)
    const regMsg = new RegExp(`^<(${vchar}+)> (.+)$`)

    if (serverInfoResult = regJoin.exec(text)) {
      info = {
        type: 'join',
        target: serverInfoResult[1],
        message: translate(lang.join, serverInfoResult)
      }
    } else if (serverInfoResult = regLeave.exec(text)) {
      info = {
        type: 'leave',
        target: serverInfoResult[1],
        message: translate(lang.leave, serverInfoResult)
      }
    } else if (regStart.exec(text)) {
      info = {
        type: 'start',
        message: lang.start
      }
    } else if (regStop.exec(text)) {
      info = {
        type: 'stop',
        message: lang.stop
      }
    } else if (serverInfoResult = regServerMsg.exec(text)) {
      if (serverInfoResult[1] === 'Server') {
        serverInfoResult[1] = lang.server
      }
      info = {
        type: 'server',
        message: translate(lang.msg, serverInfoResult)
      }
    } else if (serverInfoResult = regAdvance.exec(text)) {
      serverInfoResult[2] = lang.advancements[serverInfoResult[2]]
      info = {
        type: 'advance',
        message: translate(lang.makeAdvance, serverInfoResult)
      }
    } else if (serverInfoResult = parseDeath(text)) {
      info = {
        type: 'death',
        message: translate(lang.deathReasons[serverInfoResult[0]], serverInfoResult)
      }
    } else if (serverInfoResult = regMsg.exec(text)) {
      info = {
        type: 'chat',
        message: translate(lang.msg, serverInfoResult)
      }
    }
  }

  return info
}

module.exports = parse
