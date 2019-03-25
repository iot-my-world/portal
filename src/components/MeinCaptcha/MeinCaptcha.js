import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Collapse, Card, CardContent,
} from '@material-ui/core'

class Letter {

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

  draw(canvas) {
    let ctx
    try {
      ctx = canvas.getContext('2d')
    } catch (e) {
      console.error('error getting canvas context', e)
      return
    }

    try {
      // clear canvas
      ctx.font = '14px Roboto'
      ctx.fillText(this._letter, this._center.x, this._center.y)
    } catch (e) {
      console.error('error drawing on canvas', e)
    }
  }
}

const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&+='

const styles = theme => ({
  canvas: {
    backgroundColor: '#ffffff',
  },
  askingForCaptcha: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
  },
})

const states = {
  askingForCaptcha: 0,
  performingCaptcha: 1,
  captchaSuccess: 2,
  captchaFailure: 3,
}

const events = {
  init: states.askingForCaptcha,
  startCaptcha: states.performingCaptcha,
}

class MeinCaptcha extends Component {
  constructor(props) {
    super(props)
    this.getCanvasElement = this.getCanvasElement.bind(this)
    this.updateCanvas = this.updateCanvas.bind(this)
    this.generateCaptcha = this.generateCaptcha.bind(this)
    this.state = {
      activeState: events.init,
      canvasElement: undefined,
    }
    this.captcha = this.generateCaptcha()
    this.updateInterval = () => {
    }
  }

  generateCaptcha() {
    const {captchaLength, width, height} = this.props
    let captcha = []
    for (let i = 1; i <= captchaLength; i++) {
      captcha.push(new Letter(
          possible.charAt(Math.floor(Math.random() * possible.length)),
          {
            x: (width / (captchaLength + 1)) * (i),
            y: height / 2,
          },
      ))
    }
    return captcha
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {canvasElement} = this.state
    const {canvasElement: prevCanvasElement} = prevState
    if (
        (prevCanvasElement === undefined) &&
        (canvasElement !== undefined)
    ) {
      this.updateInterval = setInterval(this.updateCanvas, 500)
    }
  }

  updateCanvas() {
    const {canvasElement} = this.state
    const {width, height} = this.props
    let ctx
    try {
      ctx = canvasElement.getContext('2d')
    } catch (e) {
      console.error('error getting canvas context', e)
      return
    }

    try {
      // clear canvas
      ctx.clearRect(0, 0, width, height)
      this.captcha.forEach(letter => {
        letter.draw(canvasElement)
      })
      // ctx.translate(width / 2, height / 2)
      // ctx.rotate((Math.PI / 180) * 30)
      // ctx.translate(-width / 2, -height / 2)
      // ctx.font = '14px Roboto'
      // ctx.fillText('helase 8', width / 2, height / 2)
    } catch (e) {
      console.error('error drawing captcha', e)
      return
    }

    this.forceUpdate()
  }

  getCanvasElement(canvasElement) {
    this.setState({canvasElement})
  }

  render() {
    const {classes, width, height} = this.props
    const {activeState} = this.state
    return <Card style={{width: width + 32}}>
      <CardContent>
        <Collapse in={activeState === states.askingForCaptcha}>
          <div className={classes.askingForCaptcha} style={{width, height}}>
            <div>tick</div>
            <div
                onClick={() => this.setState(
                    {activeState: events.startCaptcha})}
            >
              Please captcha?
            </div>
          </div>
        </Collapse>
        <Collapse in={activeState === states.performingCaptcha}>
          <canvas
              className={classes.canvas}
              ref={this.getCanvasElement}
              width={width}
              height={height}
          />
        </Collapse>
      </CardContent>
    </Card>
  }
}

MeinCaptcha = withStyles(styles)(MeinCaptcha)

MeinCaptcha.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  captchaLength: PropTypes.number,
}
MeinCaptcha.defaultProps = {
  width: 200,
  height: 100,
  captchaLength: 5,
}

export default MeinCaptcha