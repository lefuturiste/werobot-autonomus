module.exports = class Color {
    constructor(arduino = null) {
        this.arduino = arduino
    }

    setRgbColor(r, g, b) {
        // console.log(r)
        // console.log(g)
        // console.log(b)
        this.arduino.sendCommand('COLOR', [r, g, b])
    }

    clear() {
        this.setRgbColor(0, 0, 0)
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
            (1 - a) * 255 + a * r,
            (1 - a) * 255 + a * g,
            (1 - a) * 255 + a * b
        ];
    }

    setRgbaColor(r, g, b, a) {
        let result = this.rgbaToRgb(r, g, b, a)
        this.setRgbColor(result[0], result[1], result[2])
    }

    setHexColor(hexCode, alpha) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
        this.setRgbaColor(
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            alpha
        )
    }
}