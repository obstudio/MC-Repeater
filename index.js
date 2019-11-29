const config = require('./config')
const Iconv = require('iconv').Iconv
const parse = require('./parse')
const send = require('./send')
const os = require('os')
const process = require('process')
const { execFile } = require('child_process')

const gbk2utf8 = new Iconv('GBK', 'UTF-8')

var autoRestart = config.autoRestart
function newServerProcess() {
    return execFile(config.serverStartFile, (error) => {
        if (error) {
            throw error
        }
        serverProcessStopped()
    })
}

function serverProcessInit() {
    //when serverProcess have output message
    serverProcess.stdout.on('data', (data) => {
        var content = os.type() === 'Windows_NT' ? gbk2utf8.convert(data).toString().trim() : data.toString().trim()
        if (content) {
            console.log(content)
        }        info = parse(content)
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
        serverProcess.stdin.write(os.type() === 'Windows_NT' ? 'stop\r\n' : 'stop\n')
    }
})

//create mc server child process
var serverProcess = newServerProcess()
serverProcessInit()