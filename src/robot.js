let GyroHelper = require('./gyro.js')
let MouseHelper = require('./mouse.js')
let LightHelper = require('./light.js')
let ColorHelper = require('./color.js')
let OrientationHelper = require('./orientation.js')
let MoveYHelper = require('./moveY.js')
let Arduino = require('./arduino.js')
let process = require('process')

module.exports = class Robot {
    constructor() {
        this.arduino = new Arduino()
        this.mouse = new MouseHelper()
        this.gyro = new GyroHelper(this)
        this.light = new LightHelper(this)
        this.color = new ColorHelper(this)
        this.orientation = new OrientationHelper(this)
        this.moveY = new MoveYHelper(this)
        this.gameDurationInSeconds = 20
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
        console.log('GENERAL: game started!')
        setTimeout(() => {
            this.onGameFinished()
        }, this.gameDurationInSeconds * 1000)
    }   

    onRobotReady() {
        this.light.setAsCoverValue().then(() => {
            this.light.untilDiscover().then(() => {
                console.log('GENERAL: discovered!')
                this.onGameStart()
                this.gyro.loopAngleZ()
                this.color.blinkLed(10, 0, 0, 0)

                this.moveY.goForwardY(40, 55, true).then(() => {
                    console.log('good position')
                })
            })
        })       

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
        this.arduino.sendCommand('STOPALL').then(() => {
            console.log('GENERAL: all engines stopped')
            console.log('GENERAL: autokill')
            // exit the process (autokill)
            process.exit(1)
        })
    }
}