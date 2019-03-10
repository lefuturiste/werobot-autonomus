module.exports = class Orientation {
    constructor(robot) {
        this.robot = robot
        this.lastOrientation = 0
    }

    goToOrientation(targetOrientation, precision = 2, speed = 50, inversed = false, addMode = true, addSpeed = false) {
        return new Promise((resolve, reject) => {
            this.precision = precision
            let sense = this.senseForOrientation(targetOrientation)
            if (addMode) {
                if (sense == 'right' || (sense == 'left' && inversed)) {
                    this.robot.engine.addSpeed(0, speed)
                } else {
                    this.robot.engine.addSpeed(-speed, 0)
                }
            } else {
                if (sense == 'right' || (sense == 'left' && inversed)) {
                    this.robot.engine.setSpeed(0, speed)
                } else {
                    this.robot.engine.setSpeed(-speed, 0)
                }
            }
            this.untilRightOrientation(targetOrientation, speed, sense, inversed, addSpeed).then(() => {
                // stop or revert speed
                if (addMode) {
                    this.robot.engine.revertDeltaSpeed()
                } else {
                    this.robot.engine.stopAll()
                }
                resolve()
            })
        })
    }

    untilRightOrientation(targetOrientation, speed, sense, inversed = false, addSpeed = true) {
        return new Promise((resolve) => {
            this.robot.gyro.getAngleZ().then(angle => {
                console.log('----')
                console.log('target orientation: ' + targetOrientation)
                console.log('current angle: ' + angle)
                var deltaZ = Math.abs(targetOrientation - angle)            
                console.log('deltaZ: ' + deltaZ)
                console.log('----')
                if (Math.abs(angle - this.lastOrientation) < 0.5 && addSpeed) {
                    console.log('add more speed')
                    if (sense == 'right' || (sense == 'left' && inversed)) {
                        this.robot.engine.addSpeedRight(20)
                    } else {
                        this.robot.engine.addSpeedLeft(20)
                    }
                }
                this.lastOrientation = angle
                if (deltaZ < this.precision || Math.abs(targetOrientation) < Math.abs(angle)) {
                    resolve()
                } else {
                    setTimeout(() => {
                        return this.untilRightOrientation(targetOrientation, speed, sense, inversed, addSpeed).then(resolve)
                    }, 50)
                }
            })
        })
    }

    senseForOrientation(targetOrientation = 180) {
        if (targetOrientation === 180) {
            return 'right'
        } else {
            if (targetOrientation > 0 && targetOrientation < 180) {
                return 'right'
            } else {
                return 'left'
            }
        }
    }
}