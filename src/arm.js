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
        return this.setAngle(0)
    }

    open() {
        return this.setAngle(this.openAngle)
    }

    close() {
        return this.setAngle(this.closeAngle)
    }
}