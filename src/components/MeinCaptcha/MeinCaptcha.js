import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Collapse, Card, CardContent,
  Typography, Checkbox, Input, Tooltip, Fab,
} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import RefreshIcon from '@material-ui/icons/Refresh'
import green from '@material-ui/core/colors/green'
import Letter from './Letter'

const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&+='

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
  },
  canvas: {
    backgroundColor: '#ffffff',
  },
  askingForCaptchaCard: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
  },
  checkBoxRoot: {
    color: green[600],
  },
  checkBoxChecked: {
    color: green[500],
  },
  captchaCard: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: 'auto auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
  buttonIcon: {
    margin: theme.spacing.unit,
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
    this.handleNotARobot = this.handleNotARobot.bind(this)
    this.handleRegenerate = this.handleRegenerate.bind(this)
    this.reset = this.reset.bind(this)
    this.state = {
      activeState: events.init,
      notARobotAnswer: false,
      canvasElement: undefined,
    }
    this.captcha = this.generateCaptcha()
    this.updateInterval = () => {
    }
  }

  reset() {
    this.captcha = this.generateCaptcha()
    this.setState({
      activeState: events.init,
      notARobotAnswer: false,
    })
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

  handleRegenerate() {
    this.captcha = this.generateCaptcha()
    this.forceUpdate()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {canvasElement} = this.state
    const {canvasElement: prevCanvasElement} = prevState
    const {resetToggle} = this.props
    const {resetToggle: prevResetToggle} = prevProps
    if (
        (prevCanvasElement === undefined) &&
        (canvasElement !== undefined)
    ) {
      this.updateInterval = setInterval(this.updateCanvas, 500)
    }

    if (resetToggle !== prevResetToggle) {
      this.reset()
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

  handleNotARobot(e, checked) {
    if (checked) {
      this.setState({
        activeState: events.startCaptcha,
        notARobotAnswer: checked,
      })
    }
  }

  getCanvasElement(canvasElement) {
    this.setState({canvasElement})
  }

  render() {
    const {classes, width, height} = this.props
    const {activeState, notARobotAnswer} = this.state
    let msg = ''
    switch (activeState) {
      case states.askingForCaptcha:
        msg = (
            <Typography
                variant={'body1'}
                color={'textPrimary'}
            >
              Please show that you are not a robot
            </Typography>
        )
        break

      case states.performingCaptcha:
        msg = (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              alignItems: 'center',
              justifyItems: 'center',
            }}>
              <Typography
                  variant={'body1'}
                  color={'textPrimary'}
              >
                Enter the letters which you see
              </Typography>
              <Fab
                  color='primary'
                  aria-label='Refresh'
                  size={'small'}
                  className={classes.button}
                  onClick={this.handleRegenerate}
              >
                <Tooltip title='Regenerate'>
                  <RefreshIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </div>
        )
        break
      default:
    }
    return (
        <Card style={{width: width + 32}}>
          <CardContent>
            <div className={classes.root}>
              {msg}
              <Collapse in={activeState === states.askingForCaptcha}>
                <div className={classes.askingForCaptchaCard}>
                  <Checkbox
                      onChange={this.handleNotARobot}
                      checked={notARobotAnswer}
                      classes={{
                        root: classes.checkBoxRoot,
                        checked: classes.checkBoxChecked,
                      }}
                  />
                  <Typography
                      variant={'body1'}
                      color={'textPrimary'}
                  >
                    I'm not a robot
                  </Typography>
                </div>
              </Collapse>
              <Collapse in={activeState === states.performingCaptcha}>
                <div className={classes.captchaCard}>
                  <canvas
                      style={{gridColumn: '1/3'}}
                      className={classes.canvas}
                      ref={this.getCanvasElement}
                      width={width}
                      height={height}
                  />
                  <Input/>
                  <Fab
                      color='primary'
                      aria-label='Save'
                      size={'small'}
                      className={classes.button}
                      // onClick={this.handleSavePasswordChanges}
                  >
                    <Tooltip title='Submit'>
                      <SendIcon className={classes.buttonIcon}/>
                    </Tooltip>
                  </Fab>
                </div>
              </Collapse>
            </div>
          </CardContent>
        </Card>
    )
  }
}

MeinCaptcha = withStyles(styles)(MeinCaptcha)

MeinCaptcha.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  captchaLength: PropTypes.number,
  /**
   * can be toggled by a parent to reset MeinCaptcha
   */
  resetToggle: PropTypes.bool.isRequired,
}
MeinCaptcha.defaultProps = {
  width: 280,
  height: 80,
  captchaLength: 5,
}

export default MeinCaptcha