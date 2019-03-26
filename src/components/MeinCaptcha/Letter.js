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

  constructor(letter, center) {
    this._letter = letter
    this._center = center
  }

  get letter() {
    return this._letter
  }

  draw(canvas) {
    let ctx
    try {
      ctx = canvas.getContext('2d')
    } catch (e) {
      console.error('error getting canvas context', e)
      return
    }

    try {
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
      // thus:
      // y = (y' - f - b*x)/d
      // x = (x' - e - d*y)/f

      const a = 1
      const b = 0
      const c = 0
      const d = 1
      const e = 0
      const f = 0

      ctx.setTransform(
          a,
          b,
          c,
          d,
          e,
          f,
      )
      ctx.font = '14px Roboto'
      ctx.fillText(this._letter, this._center.x, this._center.y)
    } catch (e) {
      console.error('error drawing on canvas', e)
    }
  }
}