import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Typography,
  Card, CardContent, Grid,
  TextField, Button, Dialog,
  FormControl,
} from '@material-ui/core'
import backgroundImage from 'assets/images/websiteBackground.jpg'
import logo from 'assets/images/logo.png'
import {ScaleLoader as Spinner} from 'react-spinners'
import {parseToken} from 'utilities/token'
import {MethodFailed, ContactFailed} from 'brain/apiError'

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
      display: 'grid',
      gridTemplateRows: '1fr 2fr',
    },
    contentWrapper: {
      display: 'grid',
      justifyItems: 'center',
      gridTemplateRows: 'auto auto 1fr',
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
  }
}

const states = {
  nop: 0,
  invalidURL: 1,
  urlExpired: 2,
}

const events = {
  init: states.nop,
  errorParsingLinkToJWT: states.invalidURL,
  jwtExpired: states.urlExpired
}

class RegisterUser extends Component {

  state = {
    activeState: events.init,
  }
  registrationClaims

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
  }

  componentDidMount() {
    const {
      location,
    } = this.props
    let jwt
    let registrationClaims
    try {
      jwt = (new URLSearchParams(location.search)).get('t')
      if (!jwt) {
        console.error(`jwt is null`)
        this.setState({activeState: events.errorParsingLinkToJWT})
        return
      }
    } catch (e) {
      console.error(`error parsing url: ${e}`)
      this.setState({activeState: events.errorParsingLinkToJWT})
      return
    }
    try {
      registrationClaims = parseToken(jwt)
    } catch (e) {
      console.error(`error parsing token to claims: ${e}`)
      this.setState({activeState: events.errorParsingLinkToJWT})
      return
    }
    console.log('registration claims!', registrationClaims)
    if (registrationClaims.notExpired) {
      this.registrationClaims = registrationClaims
    } else {
      this.setState({activeState: events.jwtExpired})
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
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
                                error={errorState}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Button
                              className={classes.button}
                              type={'submit'}
                          >
                            RegisterUser
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

let StyledLogin = withStyles(style)(RegisterUser)

StyledLogin.propTypes = {
  /**
   * react-router function
   */
  history: PropTypes.object.isRequired,
  /**
   * Success Action Creator
   */
  NotificationSuccess: PropTypes.func.isRequired,
  /**
   * Failure Action Creator
   */
  NotificationFailure: PropTypes.func.isRequired,
}
export default StyledLogin
