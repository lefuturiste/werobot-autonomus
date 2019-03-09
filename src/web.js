const express = require('express')
const path = require('path')

module.exports = class Web {
    constructor(robot) {
        this.robot = robot
        this.enabled = false
        this.app = express()
        this.port = 3000
        this.host = '0.0.0.0'
    }

    init() {
        return new Promise((resolve) => {
            this.app.get('/', this.index)
            this.app.get('/team/purple', (rq, rs) => this.setPurpleTeam(rq, rs))
            this.app.get('/team/yellow', (rq, rs) => this.setYellowTeam(rq, rs))
            this.app.get('/beacon/on', (rq, rs) => this.setBeaconOn(rq, rs))
            this.app.get('/beacon/off', (rq, rs) => this.setBeaconOff(rq, rs))
            this.app.get('/arm/open', (rq, rs) => this.setArmOpen(rq, rs))
            this.app.get('/arm/close', (rq, rs) => this.setArmClose(rq, rs))
            this.app.get('/electron', (rq, rs) => this.triggerElectron(rq, rs))
            this.app.get('/as-cover-value', (rq, rs) => this.setAsCoverValue(rq, rs))
            this.app.get('/stop', this.stop)
            this.app.get('/reset', (rq, rs) => this.reset(rq, rs))
            this.app.get('/test', this.triggerTest)
            this.app.listen(this.port, this.host, () => {
                console.log(`WEB: Listening on: ${this.host}:${this.port}`)
                return resolve()
            })
        })        
    }

    index(req, res) {
        return res.sendFile(path.resolve('./src/gui/index.html'))
    }

    setPurpleTeam(req, res) {
        this.robot.setPurpleTeam()
        return res.json({
            success: true
        })
    }

    setYellowTeam(req, res) {
        this.robot.setYellowTeam()
        return res.json({
            success: true
        })
    }

    setBeaconOn(req, res) {
        this.robot.beacon.enable().then(() => {
            return res.json({
                success: true
            })
        })
    }
    
    setBeaconOff(req, res) {
        this.robot.beacon.disable().then(() => {
            return res.json({
                success: true
            })
        })
    }

    setArmOpen(req, res) {
        this.robot.arm.open().then(() => {
            return res.json({ success: true })
        })
    }

    setArmClose(req, res) {
        this.robot.arm.close().then(() => {
            return res.json({
                success: true
            })
        })
    }

    triggerElectron(req, res) {
    }

    setAsCoverValue(req, res) {
        this.robot.color.clear().then(() => {
            this.robot.light.setAsCoverValue().then(() => {
                console.log('WEB: Set as cover value')
                this.robot.light.untilDiscover().then(() => {
                    this.robot.onRobotDiscovered()
                })
                return res.json({
                    success: true
                })
            })
        })
    }
    
    stop(req, res) {

    }

    reset(req, res) {
        this.robot.reset().then(() => {
            return res.json({
                success: true
            })
        })
    }

    triggerTest(req, res) {

    }

}