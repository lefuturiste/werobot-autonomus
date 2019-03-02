module.exports = class Orientation {
    constructor(arduino, gyro) {
        this.arduino = arduino
        this.gyro = gyro
    }

    goToOrientation(targetOrientation) {
        return new Promise((resolve, reject) => {
            let sense = this.senseForOrientation(targetOrientation)
            if (sense == 'right') {
                this.arduino.sendCommand('TWICE', [0, 50])
            } else {
                this.arduino.sendCommand('TWICE', [-50, 0])
            }
            this.untilRightOrientation(targetOrientation).then(() => {
                this.arduino.sendCommand('STOPALL')
                resolve()
            })
        })
    }

    untilRightOrientation(targetOrientation) {
        return new Promise((resolve) => {
            this.gyro.getAngleZ().then(angle => {
                console.log('----')
                console.log(targetOrientation)
                console.log(angle)
                var deltaZ = Math.abs(targetOrientation) - Math.abs(angle)
                console.log(deltaZ)
                console.log('----')
                if (deltaZ < 3) {
                    resolve()
                } else {
                    setTimeout(() => {
                        return this.untilRightOrientation(targetOrientation).then(resolve)
                    }, 50)
                }
            })
        })
    }

    senseForOrientation(targetOrientation = 180) {
        if (targetOrientation === 180) {
            return 'right'
        } else {
            if (targetOrientation > 0 && targetOrientation < 180) {
                return 'right'
            } else {
                return 'left'
            }
        }
    }
}