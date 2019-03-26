const angles = [
  -10,
  10,
  -20,
  20,
  -30,
  30,
  -35,
  35,
  15,
]

export default class Letter {
  /**
   * the letter to draw
   * @type {string}
   * @private
   */
  _letter = ''

  /**
   * the co-ordinate at which letter will be drawn
   * @type {{x: number, y: number}}
   * @private
   */
  _center = {x: 0, y: 0}

  _dimensions = {width: 0, height: 0}

  constructor(letter, center, dimensions) {
    this._letter = letter
    this._center = center
    this._dimensions = dimensions
  }

  get letter() {
    return this._letter
  }

  draw(canvas) {
    // create and draw on a canvas for the letter
    let letterCanvas
    let letterCanvasCtx
    try {
      letterCanvas = document.createElement('canvas')
      letterCanvas.width = this._dimensions.width
      letterCanvas.height = this._dimensions.height
      letterCanvasCtx = letterCanvas.getContext('2d')
    } catch (e) {
      console.error('error creating and getting letter canvas and context', e)
      return
    }

    try {
      // letterCanvasCtx.beginPath()
      // letterCanvasCtx.rect(0, 0, this._dimensions.width, this._dimensions.height)
      // letterCanvasCtx.fillStyle = "red"
      // letterCanvasCtx.fill()

      // warp with transform matrix
      // below is the identity matrix
      // ctx.setTransform(
      //     1,    // a: scale horizontally
      //     0,    // b: skew horizontally
      //     0,    // c: skew vertically
      //     1,    // d: scale vertically
      //     0,    // e: move horizontally
      //     0,    // f: move vertically
      // )
      // matrix results in translation of each point:
      // (x,y) --> (x',y') where:
      // x' = a*x + c*y + e
      // y' = b*x + d*y + f
      const a = 1
      const b = Math.random() * 0.8
      const c = Math.random() * 0.8
      const d = 1
      const e = 0
      const f = 0
      const xShift = (x, y) => x - (a * x + c * y + e)
      const yShift = (x, y) => y - (b * x + d * y + f)

      letterCanvasCtx.setTransform(
          a,
          b,
          c,
          d,
          e,
          f,
      )
      // letterCanvasCtx.fillStyle = "black"
      letterCanvasCtx.font = '28px Roboto'
      letterCanvasCtx.fillText(
          this._letter,
          this._dimensions.width / 2 +
          xShift(
              this._dimensions.width / 2,
              this._dimensions.height / 2,
          ),
          this._center.y +
          yShift(
              this._dimensions.width / 2,
              this._dimensions.height / 2,
          ),
      )
      // reset to to identity translation matrix
      letterCanvasCtx.setTransform(1, 0, 0, 1, 0, 0)
    } catch (e) {
      console.error('error drawing on letter canvas', e)
      return
    }

    // get context of the given canvas
    let ctx
    try {
      ctx = canvas.getContext('2d')
    } catch (e) {
      console.error('error getting canvas context', e)
      return
    }

    // draw the letter canvas onto the given canvas
    try {
      ctx.translate(
          this._center.x + this._dimensions.width / 2,
          this._center.y,
      )
      ctx.rotate(
          (Math.PI / 180) * angles[Math.floor(Math.random() * angles.length)])
      ctx.translate(
          -(this._center.x + this._dimensions.width / 2),
          -this._center.y,
      )
      ctx.drawImage(
          letterCanvas,
          this._center.x,
          this._center.y - this._dimensions.height / 2,
      )
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    } catch (e) {
      console.error('error drawing leter canvas onto given canvas', e)
    }
  }
}