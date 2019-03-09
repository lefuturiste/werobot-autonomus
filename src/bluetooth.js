const bluetooth = require('node-bluetooth');

module.exports = class Bluetooth {
    constructor(robot) {
        this.robot = robot
        this.device = new bluetooth.DeviceINQ() 
        this.whiteListedDevices = ["EC:D0:9F:3C:DD:49"]
        this.connection = null
    }

    isWhiteListed(address) {
        return this.whiteListedDevices.indexOf(address) !== -1 &&
            this.whiteListedDevices[this.whiteListedDevices.indexOf(address)] !== null &&
            this.whiteListedDevices[this.whiteListedDevices.indexOf(address)] !== undefined
    }

    init () {
        return new Promise((resolve) => {
            //this.robot.color.setPurpleTeamColor()
            console.log('BT: Searching for devices...')
            this.device.on('finished', () => {
                console.log('BT: Finished')
            })
            this.device.on('found', (address, name) => {
                console.log('BT: Found address: ' + address + ' with name ' + name);

                this.device.findSerialPortChannel(address, (channel) => {
                    console.log('BT: Found RFCOMM channel for serial port on %s: ', name, channel);

                    if (this.isWhiteListed(address)) {
                        console.log('BT: Address whitelisted')
                        // if (channel === -1) {
                        //     return this.init()
                        // }
                        bluetooth.connect(address, channel, (err, connection) => {
                            if (err) {
                                console.log('BT: Error while trying to connect')
                                console.log(err)
                                return this.init()
                            } else {
                                console.log('BT: Connected with "' + address + '", on channel ' + channel)
                                
                                this.connection = connection
                                this.connection.on('data', (buffer) => {
                                    let dataReceived = buffer.toString()
                                    console.log('BT: Received data: ' + dataReceived);
                                    switch (dataReceived) {
                                        case 'TEAM_YELLOW':
                                            this.robot.color.setYellowTeamColor()
                                            break;
                                        case 'TEAM_PURPLE':
                                            this.robot.color.setPurpleTeamColor()
                                            break;
                                        case 'BEACON_ON':
                                            this.robot.beacon.enable()
                                            break;
                                        case 'BEACON_OFF':
                                            this.robot.beacon.disable()
                                            break;
                                        case 'ARM_OPEN':
                                            this.robot.arm.open()
                                            break;
                                        case 'ARM_CLOSE':
                                            this.robot.arm.close()
                                            break;
                                        default:
                                            console.log('BT: Invalid command received')
                                            break;
                                    }
                                });

                                return resolve()
                            }
                        });
                    } else {
                        console.log('BT: Address not whitelisted')
                    }
                });
            }).scan();
        })
    }

    write(data) {
        return new Promise((resolve) => {
            this.connection.write(Buffer.from(data, 'utf-8'), () => {
                console.log("BT: data send: " + data);
                return resolve()
            })
        })
    }

    onReceivedData(buffer, robot) {
    }
}