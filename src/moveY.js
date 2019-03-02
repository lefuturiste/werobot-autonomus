module.exports = class MoveY {
    constructor(robot) {
        this.robot = robot
    }

    goForwardY(targetDistanceY, speed = 50, enableAngleRecovery = true) {
        return new Promise((resolve, reject) => {
            this.robot.mouse.reset()
            this.robot.gyro.reset().then(() => {
                this.untilRightPosition(targetDistanceY, speed, enableAngleRecovery).then(() => {
                    this.robot.arduino.sendCommand('STOPALL')
                    resolve()
                })
            })
        })
    }

    untilRightPosition(targetDistanceY, speed, enableAngleRecovery = true) {
        return new Promise((resolve) => {
            if (targetDistanceY < 0) {
                this.robot.arduino.sendCommand('TWICE', [-speed, speed])
            } else {
                this.robot.arduino.sendCommand('TWICE', [speed, -speed])
            }

            let deltaY = targetDistanceY - this.robot.mouse.relativePosition.y
            console.log(this.robot.mouse.relativePosition.y)
            console.log('delta: ' + deltaY)

            // corriger le deltaX avec le gyro pour le ramener à 0 ?
            
            this.robot.gyro.getAngleZ().then(angle => {
                console.log('angle: ' + angle)

                if ((angle < -1 || angle > 1) && enableAngleRecovery) {
                    // on recalle
                    console.log('angle correction')
                    this.robot.arduino.sendCommand('STOPALL').then(() => {
                        this.robot.gyro.reset().then(() => {
                            console.log('to correct: ' + (-angle))
                            this.robot.orientation.goToOrientation(-angle, 0.5, 35).then(() => {
                                console.log('angle corrected')
                                this.robot.gyro.reset().then(() => {
                                    return this.untilRightPosition(targetDistanceY, speed, enableAngleRecovery).then(resolve)
                                })                            
                            })
                        })
                    })
                } else {
                    if (deltaY > -1 && deltaY < 1) {
                        resolve()
                    } else {
                        setTimeout(() => {
                            return this.untilRightPosition(targetDistanceY, speed, enableAngleRecovery).then(resolve)
                        }, 50)
                    }
                }
                
            })

        })
    }
}