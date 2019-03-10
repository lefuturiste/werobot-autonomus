module.exports = class Engine {
    constructor(robot) {
        this.robot = robot
        this.leftPwm = 0
        this.rightPwm = 0
        this.maximumPwm = 200
        this.deltaSpeedLeft = 0
        this.deltaSpeedRight = 0
    }

    stopAll() {
        this.leftPwm = 0
        this.rightPwm = 0
        return this.robot.arduino.sendCommand('STOPALL')
    }

    reset() {
        return this.stopAll()
    }

    addSpeedLeft(toAddPwm = 0) {
        this.leftPwm += toAddPwm
    }

    addSpeedRight(toAddPwm = 0) {
        this.rightPwm += toAddPwm
    }

    addSpeed(toAddPwmLeft = 0, toAddPwmRight = 0) {
        console.log(toAddPwmLeft)
        console.log(toAddPwmRight)
        this.leftPwm = this.leftPwm + toAddPwmLeft
        this.rightPwm = this.rightPwm + toAddPwmRight
        this.deltaSpeedLeft += toAddPwmLeft
        this.deltaSpeedRight += toAddPwmRight
        return this.apply()
    }

    removeSpeed(toRemovePwmLeft = 0, toRemovePwmRight = 0) {
        this.leftPwm -= toRemovePwmLeft
        this.rightPwm -= toRemovePwmRight
        this.deltaSpeedLeft -= toRemovePwmLeft
        this.deltaSpeedRight -= toRemovePwmRight
        return this.apply()
    }

    setSpeed(leftPwm = 0, rightPwm = 0) {
        this.leftPwm = leftPwm
        this.rightPwm = rightPwm
        return this.apply()
    }

    apply() {
        // TWICE: commandParam1: left, commandParam2: right
        console.log([this.leftPwm, this.rightPwm])
        return this.robot.arduino.sendCommand('TWICE', [this.leftPwm, this.rightPwm])
    }

    revertDeltaSpeed() {
        return this.removeSpeed(this.deltaSpeedLeft, this.deltaSpeedRight)
    }

    resetDeltaSpeed() {
        this.deltaSpeedLeft = 0
        this.deltaSpeedRight = 0
    }
}