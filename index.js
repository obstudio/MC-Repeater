const fs = require('fs')
const config = require('./config.json')

fs.watchFile(config.logFile, (curr, prev) => {
  if (curr.size - prev.size > 0) {
    fs.open(config.logFile, 'r', (err, fd) => {
      if (err) throw err

      buffer = Buffer.alloc(curr.size - prev.size)
      fs.read(fd, buffer, 0, curr.size - prev.size, prev.size, (err, bytesRead, buffer) => {
        if (err) throw err
        content = buffer.toString().split('\r\n').filter(s => s)
        // Do something
      })

      fs.close(fd, (err) => {
        if (err) throw err
      })
    })
  }
})