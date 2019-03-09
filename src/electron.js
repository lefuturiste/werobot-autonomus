module.exports = class Beacon {
    constructor(robot) {
        this.robot = robot
    }

    trigger() {
        return this.robot.arduino.sendCommand('ELEC')
    }

    loopTrigger(timeout = 500, totalTicks = 5, currentTick = 0) {
        return new Promise((resolve) => {
            this.trigger().then(() => {
                if (currentTick >= totalTicks) {
                    setTimeout(() => {
                        currentTick = currentTick + 1
                        return this.loopTrigger(timeout, totalTicks, currentTick).then(resolve)
                    }, timeout)
                } else {
                    return resolve()
                }
            })
        })
    }
}