module.exports = class Gyro {
    constructor(robot) {
        this.robot = robot
    }

    reset() {
        return new Promise((resolve) => {
            console.log('Gyro: reseted')
            this.robot.arduino.sendCommand('RGYRO').then(() => {
                resolve()
            })
        })
    }

    getAngleZ() {
        return new Promise((resolve) => {
            this.robot.arduino.sendCommand('ANGLEZ', [], true).then(response => {
                let result = parseFloat(response.payload)
                resolve(result == NaN ? 0.00 : result)
            })
        })
    }

    loopAngleZ() {
        this.getAngleZ().then(angle => {
            console.log(angle)
        })
        setTimeout(() => {
            this.loopAngleZ()
        }, 100)
    }
}