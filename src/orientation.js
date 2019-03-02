module.exports = class Orientation {
    constructor(robot) {
        this.robot = robot
    }

    goToOrientation(targetOrientation, precision = 3, speed = 50) {
        return new Promise((resolve, reject) => {
            this.precision = precision
            let sense = this.senseForOrientation(targetOrientation)
            if (sense == 'right') {
                this.robot.arduino.sendCommand('TWICE', [0, speed])
            } else {
                this.robot.arduino.sendCommand('TWICE', [-speed, 0])
            }
            this.untilRightOrientation(targetOrientation).then(() => {
                this.robot.arduino.sendCommand('STOPALL')
                resolve()
            })
        })
    }

    untilRightOrientation(targetOrientation) {
        return new Promise((resolve) => {
            this.robot.gyro.getAngleZ().then(angle => {
                console.log('----')
                console.log(targetOrientation)
                console.log(angle)
                var deltaZ = Math.abs(targetOrientation - angle)            
                console.log(deltaZ)
                console.log('----')
                if (deltaZ < this.precision) {
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