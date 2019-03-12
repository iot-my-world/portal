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
import {Login as LoginClaimsType} from 'brain/security/claims/types'

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

  async handleLogin(submitEvent) {
    submitEvent.preventDefault()
    const {
      usernameOrEmailAddress,
      password,
    } = this.state
    const {
      SetClaims,
    } = this.props

    this.setState({activeState: events.logIn})

    // [1] Login
    let loginResult
    try {
      loginResult = await LoginService.Login(usernameOrEmailAddress, password)
    } catch (error) {
      switch (true) {
        case error instanceof MethodFailed:
          this.setState({activeState: events.loginFail})
          break
        case error instanceof ContactFailed:
        default:
          this.setState({activeState: events.serverContactError})
      }
      return
    }

    // [2] If login was successful
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
        console.error('given token is expired!', claims)
        this.setState({activeState: events.loginFail})
        return
      }
    } catch (e) {
      console.error(`error parsing claims and setting redux: ${e}`)
      this.setState({activeState: events.loginFail})
      return
    }

    // Finally set the claims which will cause root to navigate
    // to the app
    SetClaims(claims)
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
        <div className={classes.contentWrapper}>
          <div className={classes.titleInnerWrapper}>
            <img className={classes.logo} src={logo} alt={'logo'}/>
            <Typography className={classes.title} color={'primary'}
                        variant={'h3'}>
              SpotNav
            </Typography>
          </div>
          <div className={classes.loginCardWrapper}>
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
}
export default StyledLogin
