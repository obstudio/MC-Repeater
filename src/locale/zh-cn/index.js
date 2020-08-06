const basic = require('./basic')
const advancements = require('./advancements')
const deathReasons = require('./deathReasons')
const mobs = require('./mobs')

module.exports = Object.assign({}, basic, { advancements, deathReasons, mobs })
