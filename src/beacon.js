module.exports = class Beacon {
    constructor(robot) {
        this.robot = robot
        this.enabled = false
    }

    enable() {
        console.log('BEACON: Enabled')
        this.enabled = true
        return this.robot.arduino.sendCommand('ALARM#1')
    }

    disable() {
        console.log('BEACON: Disabled')
        this.enabled = false
        return this.robot.arduino.sendCommand('ALARM#0')
    }

    toggle() {
        return (this.enabled ? this.disable : this.enable)()
    }

    getStatus() {
        return { enabled: this.enabled }
    }
}