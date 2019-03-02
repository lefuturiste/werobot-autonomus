let NodeMouse = require("node-mouse")

// // 2.5cm == 500 unit of mouse pos
// // avancer == négatif
// // reculer == positif
module.exports = class Mouse {
    constructor() {
        this.rawPosition = {
            x: 0,
            y: 0
        }
        this.relativePosition = {
            x: 0,
            y: 0
        }
        this.mouse = null
    }

    init(logPosition = false) {
        this.mouse = new NodeMouse()

        this.mouse.on("mousemove", event => {
            this.rawPosition = {
                x: this.rawPosition.x - event.xDelta,
                y: this.rawPosition.y - event.yDelta
            }
            // realPosition in centimeter
            this.relativePosition = {
                x: this.mouseXyToRealXy(this.rawPosition.x),
                y: this.mouseXyToRealXy(this.rawPosition.y)
            }
            if (logPosition) {
                console.log(this.relativePosition)
            }
        });
    }

    reset() {
        this.rawPosition = {
            x: 0,
            y: 0
        }
        this.relativePosition = {
            x: 0,
            y: 0
        }
    }

    mouseXyToRealXy(mouseXy) {
        return mouseXy / 200
    }

    realXyToMouseXy(realXy) {
        return realXy * 200
    }
}