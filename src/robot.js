let GyroHelper = require('./gyro.js')
let MouseHelper = require('./mouse.js')
let LightHelper = require('./light.js')
let ColorHelper = require('./color.js')
let OrientationHelper = require('./orientation.js')
let MoveYHelper = require('./moveY.js')
let ArmHelper = require('./arm.js')
let BeaconHelper = require('./beacon.js')
let ElectronHelper = require('./electron.js')
let Arduino = require('./arduino.js')
let process = require('process')

module.exports = class Robot {
    constructor() {
        this.arduino = new Arduino()
        this.mouse = new MouseHelper()
        this.gyro = new GyroHelper(this)
        this.light = new LightHelper(this)
        this.color = new ColorHelper(this)
        this.arm = new ArmHelper(this)
        this.beacon = new BeaconHelper(this)
        this.electron = new ElectronHelper(this)
        this.orientation = new OrientationHelper(this)
        this.moveY = new MoveYHelper(this)
        this.gameDurationInSeconds = 100
    }

    init() {
        this.mouse.init(false)
        this.arduino.init().then(() => {
            // stop all engines
            this.arduino.sendCommand('STOPALL').then(() => {
                // then ping
                this.arduino.sendCommand('PING', [], true).then(response => {
                    if (response.payload !== 'pong!' || response.responseType !== 'L') {
                        console.log('GENERAL: error on ping check')
                        process.exit()
                    }                    
                    console.log('GENERAL: ROBOT READY')

                    this.onRobotReady()                    
                })
            })
        })
    }

    onGameStart() {
        this.color.clear()
        this.beacon.disable()
        this.arm.close()
        console.log('GENERAL: game started!')
        setTimeout(() => {
            this.onGameFinished()
        }, this.gameDurationInSeconds * 1000)
    }   

    onRobotReady() {
        //this.color.setPurpleTeamColor(0.10)
        //this.electron.loopTrigger(500)
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
        this.arduino.sendCommand('STOPALL').then(() => {
            console.log('GENERAL: all engines stopped')
            this.arm.close().then(() => {
                console.log('GENERAL: arm closed')
                console.log('GENERAL: autokill')
                // exit the process (autokill)
                process.exit(1)
            })
        })
    }
}