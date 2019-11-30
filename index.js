const fs = require('fs')
const Iconv = require('iconv').Iconv
const config = require('./config')
const parse = require('./parse')
const send = require('./send')
const os = require('os')

const OFFLINE_TIMEOUT = (config.offlineTimeout || 0) * 1000

const gbk2utf8 = new Iconv('GBK', 'UTF-8')
const offlinePlayers = new Set()

fs.watchFile(config.logFile, (curr, prev) => {
  if (curr.size - prev.size > 0) {
    fs.open(config.logFile, 'r', (err, fd) => {
      if (err) throw err

      buffer = Buffer.alloc(curr.size - prev.size)
      fs.read(fd, buffer, 0, curr.size - prev.size, prev.size, (err, bytesRead, buffer) => {
        if (err) throw err

        let content
        if (os.type() === 'Windows_NT') {
          content = gbk2utf8.convert(buffer).toString().split('\r\n').filter(s => s)
        } else {
          content = buffer.toString().split('\n').filter(s => s)
        }

        data = content.map(parse).filter(s => s)
        for (const info of data) {
          if (info.type === 'leave') {
            offlinePlayers.add(info.target)
            setTimeout(() => {
              if (offlinePlayers.delete(info.target)) send(info.msg)
            }, OFFLINE_TIMEOUT)
          } else {
            if (info.type === 'join') {
              if (offlinePlayers.delete(info.target)) return
            }
            send(info.msg)
          }
        }
      })

      fs.close(fd, (err) => {
        if (err) throw err
      })
    })
  }
})