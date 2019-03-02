module.exports = class Gyro {
    constructor(robot) {
        this.robot = robot
    }

    reset() {
        return new Promise((resolve) => {
            this.robot.arduino.sendCommand('RGYRO').then(() => {
                resolve()
            })
        })
    }

    getAngleZ() {
        return new Promise((resolve) => {
            this.robot.arduino.sendCommand('ANGLEZ', [], true).then(response => {
                resolve(parseFloat(response.payload))
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