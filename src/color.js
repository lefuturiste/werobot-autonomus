module.exports = class Color {
    constructor(robot) {
        this.robot = robot
        this.mustStopBlink = false
        this.yellowColor = [142, 68, 173]
        this.purpleColor = [241, 196, 15]
    }

    setRgbColor(r, g, b, leds = 0) {
        // console.log(r)
        // console.log(g)
        // console.log(b)
        return this.robot.arduino.sendCommand('COLOR', [r, g, b, leds])
    }

    clear() {
        this.setRgbColor(0, 0, 0)
    }

    stopBlink() {
        this.mustStopBlink = true
    }

    blinkLed(r, g, b, leds = 0, timeout = 500, totalTicks = -1, mode = true, currentTick = 0) {        
        return new Promise((resolve) => {
            if (this.mustStopBlink) {
                return resolve()
            }
            if (mode) {
                this.setRgbColor(r, g, b, leds)
            } else {
                this.setRgbColor(0, 0, 0, leds)
            }
            setTimeout(() => {
                if (totalTicks != -1) {
                    currentTick++
                    if (currentTick >= totalTicks) {
                        this.mustStopBlink = false
                        return resolve()
                    }
                }
                return this.blinkLed(r, g, b, leds, timeout, totalTicks, !mode, currentTick)
            }, timeout)
        })
    }

    // hexToRGB(hex, alpha) {
    //     var r = parseInt(hex.slice(1, 3), 16),
    //         g = parseInt(hex.slice(3, 5), 16),
    //         b = parseInt(hex.slice(5, 7), 16);

    //     if (alpha) {
    //         return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    //     } else {
    //         return [r + ", " + g + ", " + b + ")";
    //     }
    // }

    rgbaToRgb(r, g, b, a) {
        let back = [255, 255, 255]

        return [
            r * a,
            b * a,
            g * a
        ];
    }

    setRgbaColor(r, g, b, a, leds = 0) {
        let result = this.rgbaToRgb(r, g, b, a)
        return this.setRgbColor(result[0], result[1], result[2], leds)
    }

    setHexColor(hexCode, alpha, leds = 0) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
        return this.setRgbaColor(
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            alpha,
            leds
        )
    }

    setYellowTeamColor(alpha = 0.25) {
        return this.setRgbaColor(this.yellowColor[0], this.yellowColor[1], this.yellowColor[2], alpha)
    }
    
    setPurpleTeamColor(alpha = 0.25) {
        return this.setRgbaColor(this.purpleColor[0], this.purpleColor[1], this.purpleColor[2], alpha)
    }
}