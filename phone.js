let serialPort = require('serialport')

serialPort.list(function (err, ports) {
    if (err !== null) {
        console.log('Error while getting the list of serialport')
        console.log(err)
    }
    console.log(ports)
})