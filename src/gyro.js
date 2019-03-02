module.exports = class Gyro {
    constructor(arduino) {
        this.arduino = arduino
    }

    getAngleZ() {
        return new Promise((resolve) => {
            // resolved = false
            // arduino.sendCommand('RGYRO')
            this.arduino.sendCommand('ANGLEZ', [], true).then(response => {
                resolve(response.payload)
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