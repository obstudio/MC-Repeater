const fs = require('fs')
const config = require('./config.json')
const parse = require('./parse')
const send = require('./send')

fs.watchFile(config.logFile, (curr, prev) => {
  if (curr.size - prev.size > 0) {
    fs.open(config.logFile, 'r', (err, fd) => {
      if (err) throw err

      buffer = Buffer.alloc(curr.size - prev.size)
      fs.read(fd, buffer, 0, curr.size - prev.size, prev.size, (err, bytesRead, buffer) => {
        if (err) throw err
        content = buffer.toString().split('\r\n').filter(s => s)
        info = content.map(parse).filter(s => s)
        info.forEach(send)
      })

      fs.close(fd, (err) => {
        if (err) throw err
      })
    })
  }
})