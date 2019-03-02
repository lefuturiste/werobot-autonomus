module.exports = class MoveY {
    constructor(arduino, mouse, gyro) {
        this.arduino = arduino
        this.mouse = mouse
        this.gyro = gyro
    }

    goForwardY(targetDistanceY, speed = 50) {
        return new Promise((resolve, reject) => {
            this.mouse.reset()
            if (targetDistanceY < 0) {
                this.arduino.sendCommand('TWICE', [-speed, speed])
            } else {
                this.arduino.sendCommand('TWICE', [speed, -speed])
            }

            this.untilRightPosition(targetDistanceY).then(() => {
                this.arduino.sendCommand('STOPALL')
                resolve()
            })
        })
    }

    untilRightPosition(targetDistanceY) {
        return new Promise((resolve) => {
            let deltaY = targetDistanceY - this.mouse.relativePosition.y
            console.log(this.mouse.relativePosition)
            console.log('delta: ' + deltaY)

            // corriger le deltaX avec le gyro pour le ramener à 0 ?

            if (deltaY > -1 && deltaY < 1) {
                resolve()
            } else {
                setTimeout(() => {
                    return this.untilRightPosition(targetDistanceY).then(resolve)
                }, 50)
            }
        })
    }
}