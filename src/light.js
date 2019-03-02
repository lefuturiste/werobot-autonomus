module.exports = class Light {
    constructor(robot) {
        this.robot = robot
        this.discoveredValue = 90
        this.isDiscovered = false
    }

    getLightValue() {
        return new Promise(resolve => {
            this.robot.arduino.sendCommand('LIGHT', [], true).then(response => {
                return resolve(parseInt(response.payload))
            })
        })
    }

    setAsCoverValue() {
        return new Promise((resolve) => {
            this.getLightValue().then(value => {
                this.discoveredValue = value + 20
                return resolve()
            })
        })        
    }

    checkLightValue() {
        return new Promise((resolve) => {
            this.getLightValue().then(value => {
                // console.log(value)
                if (value >= this.discoveredValue) {
                    this.isDiscovered = true
                    resolve()
                } else {
                    setTimeout(() => {
                        return this.checkLightValue().then(resolve)
                    }, 300)
                }
            })
        })
    }

    untilDiscover() {
        return new Promise((resolve) => {
            this.checkLightValue().then(() => {
                resolve()
            })
        })
    }
}