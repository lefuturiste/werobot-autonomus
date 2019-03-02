const SerialPort = require('serialport');
const StringDecoder = new (require('string_decoder').StringDecoder)('utf8');

module.exports = class Arduino {
    constructor() {
        this.device = null
        // to filter the arduino device in the list
        this.productId = '7523'
        this.comName
        this.baudRate = 9600
        this.lastResponse = {}
    }

    init() {
        return new Promise((resolve, reject) => {
            // list all serial port and take the first as the arduino
            SerialPort.list((err, ports) => {
                if (err !== null) {
                    console.log('ARDUINO: Error while getting the list of serialports')
                    console.log(err)
                    return reject()
                }

                this.comName = ports.filter(item => item.productId === this.productId)[0].comName

                console.log('ARDUINO: Arduino plugged on ' + this.comName)
                this.device = SerialPort(
                    this.comName,
                    {
                        baudRate: this.baudRate
                    }
                )

                this.device.on('open', () => {
                    if (err) {
                        console.log("ARDUINO: can't init serialport connection")
                        console.log(err)
                        return reject()
                    }
                    setTimeout(() => {
                        return resolve()
                    }, 900)
                })
            })
        })
    }

    parseResponse(data) {
        let decodedData = StringDecoder.write(data)
        let responseType = decodedData.split(': ')[0]
        let payload = decodedData.split(': ')[1].replace('\r\n', '')
        // console.log(decodedData)
        return {
            responseType,
            payload
        }
    }

    sendCommand(name, params = [], expectResponse = false) {
        return new Promise((resolve, reject) => {
            let toSend = name.toUpperCase()
            if (params.length <= 3) {
                params.forEach(p => {
                    toSend += '#' + p
                })
            }
            toSend += '\n'
            if (expectResponse) {
                this.device.removeAllListeners()
                this.device.on('data', data => {
                    return resolve(this.parseResponse(data))
                })
            }
            this.device.write(toSend, (err) => {
                if (err !== undefined) {
                    console.log("ARDUINO: Can't send a command")
                    console.log(err)
                    return reject()
                } else {
                    if (!expectResponse) {
                        resolve()
                    }
                }
            })
        })
    }
}