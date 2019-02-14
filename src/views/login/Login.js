import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Typography,
  Card, CardContent, Grid,
  TextField, Button, Dialog,
  FormControl, CardHeader,
} from '@material-ui/core'
import backgroundImage from 'assets/images/websiteBackground.jpg'
import logo from 'assets/images/logo.png'
import {ScaleLoader as Spinner} from 'react-spinners'
import LoginService from 'brain/security/auth/Service'
import {parseToken} from 'utilities/token'
import {MethodFailed, ContactFailed} from 'brain/apiError'
import LoginClaims from 'brain/security/auth/claims/LoginClaims'

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
    loginCardWrapper: {},
    button: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
    progressSpinnerDialog: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      overflow: 'hidden',
    },
    progressSpinnerDialogBackdrop: {
      // backgroundColor: 'transparent',
    },
    cardHeaderRoot: {
      paddingBottom: 0,
    },
  }
}

const states = {
  nop: 0,
  loggingIn: 1,
  incorrectCredentials: 2,
  unableToContactServer: 3,
}

const events = {
  init: states.nop,
  logIn: states.loggingIn,
  loginFail: states.incorrectCredentials,
  serverContactError: states.unableToContactServer,
}

class Login extends Component {

  state = {
    activeState: events.init,
    usernameOrEmailAddress: '',
    password: '',
  }

  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.errorMessage = this.errorMessage.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
      activeState: events.init,
    })
  }

  handleLogin(submitEvent) {
    submitEvent.preventDefault()
    const {
      usernameOrEmailAddress,
      password,
    } = this.state
    const {
      SetClaims,
      history,
    } = this.props

    this.setState({activeState: events.logIn})

    LoginService.Login(usernameOrEmailAddress, password).then(result => {
      // parse the claims and set them in redux
      try {
        const claims = parseToken(result.jwt)

        if (
            claims.notExpired &&
            (claims.type === LoginClaims.type)
        ) {
          // otherwise the token is not expired
          // set the claims in redux state
          SetClaims(claims)
          // and set the token in local storage
          sessionStorage.setItem('jwt', result.jwt)
        } else {
          // if the token is expired clear the token state
          sessionStorage.setItem('jwt', null)
          console.error('given token is expired!')
          return
        }
      } catch (e) {
        console.error(`error parsing claims and setting redux: ${e}`)
      }

      // navigate the browser to the app
      try {
        history.push('/app')
      } catch (e) {
        console.error(`error navigating the browser to the app: ${e}`)
      }
    }).catch(err => {
      switch (true) {
        case err instanceof MethodFailed:
          this.setState({activeState: events.loginFail})
          break
        case err instanceof ContactFailed:
        default:
          this.setState({activeState: events.serverContactError})
      }
    })

  }

  errorMessage() {
    const {
      activeState,
    } = this.state

    switch (activeState) {
      case states.incorrectCredentials:
        return 'Incorrect Credentials'
      case states.unableToContactServer:
        return 'Unable To Contact Server'
      default:
        return undefined
    }
  }

  render() {
    const {
      classes,
    } = this.props
    const {
      activeState,
      usernameOrEmailAddress,
      password,
    } = this.state

    const errorState = (activeState === states.incorrectCredentials) ||
        (activeState === states.unableToContactServer)

    return <div
        className={classes.fullPageBackground}
        style={{backgroundImage: 'url(' + backgroundImage + ')'}}
    >
      <div className={classes.root}>
        <div/>
        <div className={classes.contentWrapper}>
          <div className={classes.titleInnerWrapper}>
            <img className={classes.logo} src={logo} alt={'logo'}/>
            <Typography className={classes.title} color={'primary'}
                        variant={'h3'}>
              SpotNav
            </Typography>
          </div>
          <div className={classes.loginCardWrapper}>
            <Grid container>
              <Grid item>
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
                                error={errorState}
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
                                error={errorState}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Button
                              className={classes.button}
                              type={'submit'}
                          >
                            Login
                          </Button>
                        </Grid>
                        {errorState &&
                        <Grid item>
                          <Typography color={'error'}>
                            {this.errorMessage()}
                          </Typography>
                        </Grid>}
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <Dialog
          open={activeState === states.loggingIn}
          BackdropProps={{classes: {root: classes.progressSpinnerDialogBackdrop}}}
          PaperProps={{classes: {root: classes.progressSpinnerDialog}}}
          className={classes.progressSpinnerDialog}
      >
        <Spinner isLoading/>
      </Dialog>
    </div>
  }
}

let StyledLogin = withStyles(style)(Login)

StyledLogin.propTypes = {
  SetClaims: PropTypes.func.isRequired,
  /**
   * react-router function
   */
  history: PropTypes.object.isRequired,
}
export default StyledLogin
