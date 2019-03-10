let GyroHelper = require('./gyro.js')
let EngineHelper = require('./engine.js')
let MouseHelper = require('./mouse.js')
let LightHelper = require('./light.js')
let ColorHelper = require('./color.js')
let OrientationHelper = require('./orientation.js')
let MoveYHelper = require('./moveY.js')
let ArmHelper = require('./arm.js')
let BeaconHelper = require('./beacon.js')
let ElectronHelper = require('./electron.js')
// let BluetoothHelper = require('./bluetooth.js')
let Web = require('./web.js')
let Arduino = require('./arduino.js')
let process = require('process')

module.exports = class Robot {
    constructor() {
        this.arduino = new Arduino()
        this.mouse = new MouseHelper()
        this.engine = new EngineHelper(this)
        this.gyro = new GyroHelper(this)
        this.light = new LightHelper(this)
        this.color = new ColorHelper(this)
        this.arm = new ArmHelper(this)
        this.beacon = new BeaconHelper(this)
        this.electron = new ElectronHelper(this)
        this.orientation = new OrientationHelper(this)
        this.moveY = new MoveYHelper(this)
        //this.bluetooth = new BluetoothHelper(this)
        this.web = new Web(this)
        this.gameDurationInSeconds = 100
        this.team = 'purple'
    }

    init() {
        console.log('GENERAL: Initialization started...')
        this.mouse.init(false)
        this.arduino.init().then(() => {
            // then ping
            this.arduino.isAlive().then(() => {
                console.log('GENERAL: ROBOT READY')
                this.color.setRgbaColor(0, 255, 0, 0.25, 1)
                this.reset().then(() => {
                    this.color.setRgbaColor(0, 0, 255, 0.25, 1)
                    setTimeout(() => {
                        this.moveY.goForwardY(30, 75, true).then(() => {
                            console.log('good position')
                            // this.moveY.goForwardY(-60, 75, true).then(() => {
                            //     console.log('good position')
                            // })
                        })
                        // // this.engine.setSpeed(100, -100)
                    //    this.moveY.goForwardY(60, 75, true).then(() => {
                    //        console.log('good position')
                    //        this.orientation.goToOrientation(90).then(() => {
                    //            console.log('good orientation')
                    //            this.moveY.goForwardY(40, 75, true).then(() => {
                    //                console.log('good position')
                    //                this.orientation.goToOrientation(-80).then(() => {
                    //                    this.moveY.goForwardY(60, 75, true).then(() => {
                    //                        console.log('good position')
                    //                        this.orientation.goToOrientation(-20).then(() => {
                    //                            console.log('good orientation')
                    //                        })
                    //                    })
                    //                })
                    //            })
                    //        })
                    //    })
                    }, 500)
                    // GOOD CALIBRATED JOURNEY
                    
                    
                    
                    // this.web.init().then(() => {
                    //     this.color.setRgbaColor(0, 255, 0, 0.25, 7)
                    // })
                })
            }).catch(() => {
                console.log('GENERAL: Error on ping check')
                process.exit()
            })
        })
    }

    // orientationLoop(bool = false) {
    //     this.orientation.goToOrientation(bool ? 20 : -20, 3, 50, false, false, false).then(() => {
    //         setTimeout(() => {
    //             this.orientationLoop(!bool)
    //         }, 500)
    //     })
    // }

    onGameStart() {
        console.log('GENERAL: game started!')
        setTimeout(() => {
            this.onGameFinished()
        }, this.gameDurationInSeconds * 1000)
    }

    onRobotDiscovered () {
        console.log('GENERAL: Discovered!')
        this.showTeamColor()        
    }

    onRobotReady() {
        //this.color.setPurpleTeamColor(0.10)
        // this.electron.loopTrigger(500).then(() => {
        //     console.log('electron finished')
        // })
        //this.beacon.disable()
        // this.light.setAsCoverValue().then(() => {
        //     this.light.untilDiscover().then(() => {
        //         console.log('GENERAL: discovered!')
        //         this.onGameStart()
        //         // this.arm.open()
        //         // this.gyro.loopAngleZ()
        //         // this.color.blinkLed(10, 0, 0, 0)
        //         // this.beacon.enable()          

        //     //    this.orientation.goToOrientation(15, 0.5, 10).then(() => {
        //     //        console.log('orientation success')
        //     //    })
        //         // this.orientation.goToOrientation(90, 3, 75).then(() => {

        //         // })


        //         // GOOD CALIBRATED JOURNEY
        //         // this.moveY.goForwardY(60, 75, true).then(() => {
        //         //     console.log('good position')
        //         //     this.orientation.goToOrientation(90).then(() => {
        //         //         console.log('good orientation')
        //         //         this.moveY.goForwardY(40, 75, true).then(() => {
        //         //             console.log('good position')
        //         //             this.orientation.goToOrientation(-80).then(() => {
        //         //                 this.moveY.goForwardY(60, 75, true).then(() => {
        //         //                     console.log('good position')
        //         //                     this.orientation.goToOrientation(-20).then(() => {
        //         //                         console.log('good orientation')
        //         //                     })
        //         //                 })
        //         //             })
        //         //         })
        //         //     })
        //         // })
        //     })
        // })       

        // setTimeout(() => {
        //     // stop all in 100 seconds
        //     console.log('GENERAL: end of the game!')
        //     Arduino.sendCommand('STOPALL')
        // }, 1000 * 5)
        // ColorHelper.clear();

        // })  
        // console.log('GENERAL: ROBOT DISCOVERED')
        // game started
        // ColorHelper.setRgbColor(0, 0, 0, 1).then(() => {
        //     MoveYHelper.goForwardY(60, 55, true).then(() => {
        //         console.log('good position')
        //     })
        // })
        // OrientationHelper.goToOrientation(-2, 0.5, 30).then(() => {
        //     console.log('right orientation')
        // })

        // OrientationHelper.goToOrientation(90).then(() => {
        //     console.log('right orientation')

        // })

        // ColorHelper.setRgbColor(0, 10, 0);
        // ColorHelper.setHexColor('#0033ff', 0)
    }

    onGameFinished() {
        console.log('GENERAL: end of the game')
        this.color.setRgbColor(0, 0, 10)
        this.reset().then(() => {
            console.log('GENERAL: autokill')
            // exit the process (autokill)
            process.exit(1)
        })
    }

    reset() {
        return new Promise((resolve) => {
            this.engine.stopAll().then(() => {
                this.color.clear().then(() => {
                    this.beacon.disable().then(() => {
                        this.arm.close().then(() => {
                            console.log('GENERAL: Robot reseted')
                            return resolve()
                        })
                    })
                })
            })
        })
    }

    setYellowTeam() {
        this.team = "yellow"
        console.log('GENERAL: Team is now yellow')
        return this.color.setYellowTeamColor()
    }

    setPurpleTeam() {
        this.team = "purple"
        console.log('GENERAL: Team is now purple')
        return this.color.setPurpleTeamColor()
    }

    showTeamColor() {
        return this.team === 'yellow' ? this.color.setYellowTeamColor() : this.color.setPurpleTeamColor()
    }
}