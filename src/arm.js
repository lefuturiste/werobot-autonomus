module.exports = class Arm {
    constructor(robot) {
        this.robot = robot
        this.openAngle = 180
        this.closeAngle = 0
    }

    setAngle(angle = 0) {
        return this.robot.arduino.sendCommand('ARM', [angle])
    }

    reset() {
        console.log('ARM: Reseted')
        return this.setAngle(0)
    }

    open() {
        console.log('ARM: Opened')
        return this.setAngle(this.openAngle)
    }

    close() {
        console.log('ARM: Closed')
        return this.setAngle(this.closeAngle)
    }
}