module.exports = class MoveY {
    constructor(robot) {
        this.robot = robot
        this.lastPositionY = 0
    }

    goForwardY(targetDistanceY, speed = 50, enableAngleRecovery = true) {
        return new Promise((resolve, reject) => {
            this.robot.mouse.reset()
            this.robot.gyro.reset().then(() => {
                if (targetDistanceY < 0) {
                    this.robot.engine.setSpeed(-speed, speed)
                } else {
                    this.robot.engine.setSpeed(speed, -speed)
                }
                this.untilRightPosition(targetDistanceY, speed, enableAngleRecovery).then(() => {
                    this.robot.engine.stopAll()
                    resolve()
                })
            })
        })
    }

    untilRightPosition(targetDistanceY, speed, enableAngleRecovery = true, addSpeed = true) {
        // TODO: add speed when the current position y is blocked and don't change enought
        return new Promise((resolve) => {

            let deltaY = targetDistanceY - this.robot.mouse.relativePosition.y
            console.log('MOVEY: targetY: ' + targetDistanceY)
            console.log('MOVEY: CurrentY: ' + this.robot.mouse.relativePosition.y)
            console.log('MOVEY: DeltaY: ' + deltaY)

            // verify the position y and add more speed
            if (Math.abs(this.robot.mouse.relativePosition.y - this.lastPositionY) < 0.5 && addSpeed) {
                console.log('MOVEY: add more speed')
                if (targetDistanceY < 0) {
                    this.robot.engine.addSpeed(-20, 20)
                } else {
                    this.robot.engine.addSpeed(20, -20)
                }
            }
            this.lastPositionY = this.robot.mouse.relativePosition.y

            if (targetDistanceY > 0 && (deltaY <= 1)) {
                // if positive (go forward)
                return resolve()
            } else if (targetDistanceY < 0 && (deltaY >= -1)) {
                // if negative (go backward)
                return resolve()
            }
            this.robot.gyro.getAngleZ().then(angle => {
                console.log('angle: ' + angle)

                if ((angle < -1 || angle > 1) && enableAngleRecovery) {
                    // angle correction
                    console.log('angle correction')
                    // this.robot.engine.stopAll().then(() => {
                        
                    // })
                    let toCorrectAngle = targetDistanceY < 0 ? angle : -angle
                    this.robot.gyro.reset().then(() => {
                        console.log('to correct: ' + toCorrectAngle)
                        this.robot.orientation.goToOrientation(toCorrectAngle, 1, 50, targetDistanceY < 0, false).then(() => {
                            console.log('angle corrected')
                            this.robot.gyro.reset().then(() => {
                                return this.untilRightPosition(targetDistanceY, speed, enableAngleRecovery).then(resolve)
                            })
                        })
                    })
                } else {
                    // carry on
                    setTimeout(() => {
                        return this.untilRightPosition(targetDistanceY, speed, enableAngleRecovery).then(resolve)
                    }, 50)                    
                }                          
            })

        })
    }
}