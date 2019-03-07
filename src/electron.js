module.exports = class Beacon {
    constructor(robot) {
        this.robot = robot
    }

    trigger() {
        return this.robot.arduino.sendCommand('ELEC')
    }

    loopTrigger(timeout = 500) {
        this.trigger().then(() => {
            setTimeout(() => {
                this.loopTrigger(timeout)
            }, timeout)
        })
    }
}