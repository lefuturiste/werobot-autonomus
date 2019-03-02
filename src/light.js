module.exports = class Light {
    constructor(arduino) {
        this.arduino = arduino
        this.discoveredValue = 90
        this.isDiscovered = false
    }

    checkLightValue() {
        return new Promise((resolve) => {
            this.arduino.sendCommand('LIGHT', [], true).then(response => {
                let lightValue = parseInt(response.payload)
                // console.log(lightValue)
                if (lightValue >= this.discoveredValue) {
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