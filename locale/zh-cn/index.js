const custom = require('./custom')

const basic = Object.assign({}, require('./basic'), custom.basic)
const advancements = Object.assign({}, require('./advancements'), custom.advancements)
const deathReasons = Object.assign({}, require('./deathReasons'), custom.deathReasons)
const mobs = Object.assign({}, require('./mobs'), custom.mobs)

module.exports = Object.assign({}, basic, { advancements, deathReasons, mobs })
