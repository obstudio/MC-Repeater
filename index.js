#!/usr/bin/env node

const Iconv = require('iconv').Iconv
const parse = require('./parse')
const send = require('./send')
const os = require('os')
const process = require('process')
const { execFile } = require('child_process')
const config = require(process.cwd() + '/config')

const OFFLINE_TIMEOUT = (config.offlineTimeout || 0) * 1000

const gbk2utf8 = new Iconv('GBK', 'UTF-8')
const offlinePlayers = new Set()

const isWindows = os.type() === 'Windows_NT'
const messageMask = config.messageMask ? config.messageMask.map((type) => type.toString().trim().toLowerCase()) : undefined

let serverProcess

let autoRestart = config.autoRestart

function filterMessage(message, type) {
  if (messageMask && messageMask.includes(type)) return
  send(message)
}

function newServerProcess() {
  return execFile(config.serverStart, { encoding: 'buffer' }, (error) => {
    if (error) {
      throw error
    }
    serverProcessStopped()
  })
}

function serverProcessInit() {
  //when serverProcess have output message
  serverProcess.stdout.on('data', (data) => {
    const content = isWindows ? gbk2utf8.convert(data).toString().trim() : data.toString().trim()
    if (content) {
      console.log(content)
    }
    const info = parse(content)
    if (info) {
      if (info.type === 'leave' && OFFLINE_TIMEOUT) {
        offlinePlayers.add(info.target)
        setTimeout(() => {
          if (offlinePlayers.delete(info.target)) {
            try {
              filterMessage(info.message, info.type)
            } catch (error) {
              console.log(error)
            }
          }
        }, OFFLINE_TIMEOUT)
      } else {
        if (info.type === 'join') {
          if (offlinePlayers.delete(info.target)) return
        }
        try {
          filterMessage(info.message, info.type)
        } catch (error) {
          console.log(error)
        }
      }
    }
  })

  //send the parent process input to serverProcess input
  process.stdin.pipe(serverProcess.stdin)
}

function serverProcessStopped() {
  if (autoRestart) {
    console.log('Server is restarting.')
    serverProcess = newServerProcess()
    serverProcessInit()
  } else {
    console.log('MC-Repeater stopped.')
    process.exit()
  }
}

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'stop') {
    autoRestart = false
  }
})

//create mc server child process
serverProcess = newServerProcess()
serverProcessInit()