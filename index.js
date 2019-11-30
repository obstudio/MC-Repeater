const config = require('./config')
const Iconv = require('iconv').Iconv
const parse = require('./parse')
const send = require('./send')
const os = require('os')
const process = require('process')
const child_process = require('child_process')

const gbk2utf8 = new Iconv('GBK', 'UTF-8')
const isWindows = os.type() === 'Windows_NT'

let serverProcess

let autoRestart = config.autoRestart
function newServerProcess() {
  return child_process.execFile(config.serverStartFile, {encoding: 'buffer'}, (error) => {
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
    info = parse(content)
    if (info) {
      send(info.message)
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
  if (data.toString().trim() === 'stopMCRepeater') {
    autoRestart = false
    serverProcess.stdin.write(isWindows ? 'stop\r\n' : 'stop\n')
  }
})

//create mc server child process
serverProcess = newServerProcess()
serverProcessInit()