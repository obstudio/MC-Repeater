const config = require('./config')
const Iconv = require('iconv').Iconv
const parse = require('./parse')
const send = require('./send')
const os = require('os')
const process = require('process')
const { execFile } = require('child_process')

const gbk2utf8 = new Iconv('GBK', 'UTF-8')

//create mc server child process
const serverProcess = execFile(config.serverStartFile, (error) => {
    if (error) {
        throw error
    }
})

//send the parent process input to serverProcess input
process.stdin.pipe(serverProcess.stdin)

//when serverProcess have output message
serverProcess.stdout.on('data', (data) => {
    var content = os.type() === 'Windows_NT' ? gbk2utf8.convert(data).toString() : data.toString()
    info = parse(content)
    if (info) {
        send(info)
    }
    console.log(content)
})

//Stop server before main process stop.
process.on('exit', () => {
    serverProcess.stdin.write(os.type() === 'Windows_NT' ? 'stop\r\n' : 'stop\n')
})
