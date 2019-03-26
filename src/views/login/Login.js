import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Typography,
  Card, CardContent, Grid,
  TextField, Button,
  FormControl, CardHeader,
  Collapse,
} from '@material-ui/core'
import backgroundImage from 'assets/images/websiteBackground.jpg'
import logo from 'assets/images/logo.png'
import LoginService from 'brain/security/auth/Service'
import {parseToken} from 'utilities/token'
import {MethodFailed, ContactFailed} from 'brain/apiError'
import {Login as LoginClaimsType} from 'brain/security/claims/types'
import {ReasonsInvalid, ReasonInvalid} from 'brain/validate'
import MeinCaptcha from 'components/MeinCaptcha/MeinCaptcha'

const style = theme => {
  return {
    fullPageBackground: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      display: 'block',
      top: '0',
      left: '0',
      backgroundSize: 'cover',
      backgroundPosition: 'right top',
    },
    root: {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentWrapper: {
      display: 'grid',
      justifyItems: 'center',
      gridTemplateRows: 'auto auto',
    },
    titleInnerWrapper: {
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      alignItems: 'center',
    },
    logo: {
      justifySelf: 'end',
      height: '50px',
      width: '50px',
      padding: '10px',
    },
    title: {
      justifySelf: 'start',
      color: '#ffffff',
    },
    formField: {
      width: '200px',
    },
    button: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
    forgotPassword: {
      cursor: 'pointer',
    },
  }
}

const states = {
  loggingIn: 0,
  logInFail: 1,
  errorContactingServer: 2,
  forgottenPassword: 3,
}

const events = {
  // init: states.loggingIn,
  init: states.forgottenPassword,
  logInFail: states.logInFail,
  errorContactingServer: states.errorContactingServer,
  forgotPassword: states.forgottenPassword,
}

class Login extends Component {

  state = {
    activeState: events.init,
    usernameOrEmailAddress: '',
    password: '',
    cursorOverForgotPassword: false,
    cursorOverReturn: false,
  }

  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.errorMessage = this.errorMessage.bind(this)
    this.renderLogInCard = this.renderLogInCard.bind(this)
    this.renderForgotPasswordCard = this.renderForgotPasswordCard.bind(this)
  }

  handleInputChange(event) {
    this.reasonsInvalid.clearField(event.target.id)
    this.setState({
      [event.target.id]: event.target.value,
      activeState: events.init,
    })
  }

  reasonsInvalid = new ReasonsInvalid()

  async handleLogin(submitEvent) {
    submitEvent.preventDefault()
    const {
      usernameOrEmailAddress,
      password,
    } = this.state
    const {
      SetClaims,
      LoginActionCreator,
      ShowGlobalLoader,
      HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()

    this.reasonsInvalid.clearAll()

    // blank checks
    if (usernameOrEmailAddress === '') {
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'usernameOrEmailAddress',
        type: 'blank',
        help: 'can\'t be blank',
        data: usernameOrEmailAddress,
      }))
    }
    if (password === '') {
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'password',
        type: 'blank',
        help: 'can\'t be blank',
        data: password,
      }))
    }
    if (this.reasonsInvalid.count > 0) {
      HideGlobalLoader()
      this.forceUpdate()
      return
    }

    // login
    let loginResult
    try {
      loginResult = await LoginService.Login(usernameOrEmailAddress, password)
    } catch (error) {
      switch (true) {
        case error instanceof MethodFailed:
          this.setState({activeState: events.logInFail})
          HideGlobalLoader()
          return

        case error instanceof ContactFailed:
        default:
          this.setState({activeState: events.errorContactingServer})
          HideGlobalLoader()
          return
      }
    }

    // if login was successful
    let claims
    try {
      claims = parseToken(loginResult.jwt)

      if (
          claims.notExpired &&
          (claims.type === LoginClaimsType)
      ) {
        // and set the token in local storage
        sessionStorage.setItem('jwt', loginResult.jwt)
      } else {
        // if the token is expired clear the token state
        sessionStorage.setItem('jwt', null)
        this.setState({activeState: events.logInFail})
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error(`error parsing claims and setting redux: ${e}`)
      this.setState({activeState: events.logInFail})
      HideGlobalLoader()
      return
    }

    HideGlobalLoader()
    // Finally set the claims which will cause root to navigate
    // to the app
    SetClaims(claims)
    // call login action creator
    LoginActionCreator()
  }

  errorMessage() {
    const {
      activeState,
    } = this.state

    switch (activeState) {
      case states.logInFail:
        return 'Incorrect Credentials'
      case states.errorContactingServer:
        return 'Unable To Contact Server'
      default:
        return undefined
    }
  }

  renderLogInCard() {
    const {
      classes,
    } = this.props
    const {
      usernameOrEmailAddress,
      password,
      cursorOverForgotPassword,
    } = this.state

    const fieldValidations = this.reasonsInvalid.toMap()

    return (
        <Card>
          <CardHeader
              title={'Login'}
              titleTypographyProps={{color: 'primary', align: 'center'}}
              classes={{root: classes.cardHeaderRoot}}
          />
          <CardContent>
            <form onSubmit={this.handleLogin}>
              <Grid container direction={'column'} alignItems={'center'}
                    spacing={8}>
                <Grid item>
                  <FormControl className={classes.formField}>
                    <TextField
                        id='usernameOrEmailAddress'
                        label='Username or Email Address'
                        autoComplete='username'
                        value={usernameOrEmailAddress}
                        onChange={this.handleInputChange}
                        helperText={
                          fieldValidations.usernameOrEmailAddress
                              ? fieldValidations.usernameOrEmailAddress.help
                              : undefined
                        }
                        error={!!fieldValidations.usernameOrEmailAddress}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl className={classes.formField}>
                    <TextField
                        id='password'
                        label='Password'
                        type='password'
                        autoComplete='current-password'
                        value={password}
                        onChange={this.handleInputChange}
                        helperText={
                          fieldValidations.password
                              ? fieldValidations.password.help
                              : undefined
                        }
                        error={!!fieldValidations.password}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button
                      id={'loginButton'}
                      className={classes.button}
                      type={'submit'}
                  >
                    Login
                  </Button>
                </Grid>
                {(!!this.errorMessage()) &&
                <Grid item>
                  <Typography color={'error'}>
                    {this.errorMessage()}
                  </Typography>
                </Grid>}
                <Grid item>
                  <Typography
                      className={classes.forgotPassword}
                      onMouseEnter={() => this.setState({
                        cursorOverForgotPassword: true,
                      })}
                      onMouseLeave={() => this.setState({
                        cursorOverForgotPassword: false,
                      })}
                      onClick={() => this.setState({
                        activeState: events.forgotPassword,
                      })}
                      color={cursorOverForgotPassword ?
                          'secondary' :
                          'primary'}
                  >
                    Forgot Password
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
    )
  }

  renderForgotPasswordCard() {
    const {classes} = this.props
    const {cursorOverReturn, activeState} = this.state
    const showForgottenPassword =
        (activeState === states.forgottenPassword)
    return (
        <Card>
          <CardHeader
              title={'Forgot Password'}
              titleTypographyProps={{color: 'primary', align: 'center'}}
              classes={{root: classes.cardHeaderRoot}}
          />
          <CardContent>
            <Grid container direction={'column'} alignItems={'center'}
                  spacing={8}>
              <Grid item>
                <MeinCaptcha resetToggle={showForgottenPassword}/>
              </Grid>
              <Grid item>
                <Typography
                    className={classes.forgotPassword}
                    onMouseEnter={() => this.setState({
                      cursorOverReturn: true,
                    })}
                    onMouseLeave={() => this.setState({
                      cursorOverReturn: false,
                    })}
                    onClick={() => this.setState({
                      activeState: events.init,
                    })}
                    color={cursorOverReturn ?
                        'secondary' :
                        'primary'}
                >
                  Return to Login
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
    )
  }

  render() {
    const {
      classes,
    } = this.props
    const {
      activeState,
    } = this.state

    const showLoginCard =
        (activeState === states.loggingIn) ||
        (activeState === states.errorContactingServer) ||
        (activeState === states.logInFail)
    const showForgottenPassword =
        (activeState === states.forgottenPassword)

    return <div
        className={classes.fullPageBackground}
        style={{backgroundImage: 'url(' + backgroundImage + ')'}}
    >
      <div className={classes.root}>
        <div className={classes.contentWrapper}>
          <div className={classes.titleInnerWrapper}>
            <img className={classes.logo} src={logo} alt={'logo'}/>
            <Typography className={classes.title} color={'primary'}
                        variant={'h3'}>
              SpotNav
            </Typography>
          </div>
          <Collapse in={showLoginCard}>
            <div>
              {this.renderLogInCard()}
            </div>
          </Collapse>
          <Collapse in={showForgottenPassword}>
            <div>
              {this.renderForgotPasswordCard()}
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  }
}

let StyledLogin = withStyles(style)(Login)

StyledLogin.propTypes = {
  SetClaims: PropTypes.func.isRequired,
  LoginActionCreator: PropTypes.func.isRequired,
  /**
   * Show Global Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global Loader Action Creator
   */
  HideGlobalLoader: PropTypes.func.isRequired,
}
export default StyledLogin
