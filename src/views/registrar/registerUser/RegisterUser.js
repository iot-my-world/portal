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
import {parseToken} from 'utilities/token'
import {User as UserEntity} from 'brain/party/user'

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
  passwordsDoNotMatch: 3,
}

const events = {
  init: states.nop,
  errorParsingLinkToJWT: states.invalidURL,
  jwtExpired: states.urlExpired,
  passwordsDoNotMatch: states.passwordsDoNotMatch,
}

class RegisterUser extends Component {

  state = {
    isLoading: false,
    activeState: events.init,
    user: new UserEntity(),
    confirmPassword: '',
  }
  registrationClaims

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
  }

  handleChange(event) {
    let {
      user,
    } = this.state
    const {
      activeState,
    } = this.state
    if (event.target.id === 'confirmPassword') {
      this.setState({confirmPassword: event.target.value})
    } else {
      user[event.target.id] = event.target.value
      // this.reasonsInvalid.clearField(event.target.id)
      this.setState({user})
    }
    if (
        (activeState === states.passwordsDoNotMatch) &&
        (
            (event.target.id === 'confirmPassword') ||
            (event.target.id === 'password')
        )
    ) {
      this.setState({activeState: events.init})
    }
  }

  handleRegister() {
    const {
      user,
      confirmPassword,
    } = this.state
    const {
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    // confirm that password is entered correctly
    if (user.password !== confirmPassword) {
      this.setState({activeState: events.passwordsDoNotMatch})
      return
    }

    // if so attempt to validate and then register
    try {
      // this.setState({isLoading: true})
      user.validate('Create').then(reasonsInvalid => {
        console.log('Validate Success!', reasonsInvalid)
      }).catch(error => {
        console.error('Error Validating User', error)
        NotificationFailure('Error Validating User')
        this.setState({isLoading: false})
      })
    } catch (error) {
      console.error('Error Registering User', error)
      NotificationFailure('Error Registering User')
    }
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
      sessionStorage.setItem('jwt', jwt)
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
      user,
      confirmPassword,
      isLoading,
    } = this.state

    const errorState = (activeState === states.incorrectCredentials) ||
        (activeState === states.unableToContactServer)

    const passwordsDoNotMatch = activeState === states.passwordsDoNotMatch

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
            <Grid container>
              <Grid item>
                <Card>
                  <CardHeader
                      title={'User Registration'}
                      titleTypographyProps={{color: 'primary', align: 'center'}}
                  />
                  <CardContent>
                    <form>
                      <Grid container direction={'column'} alignItems={'center'}
                            spacing={8}>
                        <Grid item>
                          <FormControl className={classes.formField}>
                            <TextField
                                id='name'
                                label='Name'
                                autoComplete='name'
                                value={user.name}
                                onChange={this.handleChange}
                                error={errorState}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <FormControl className={classes.formField}>
                            <TextField
                                id='surname'
                                label='Surname'
                                autoComplete='surname'
                                value={user.surname}
                                onChange={this.handleChange}
                                error={errorState}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <FormControl className={classes.formField}>
                            <TextField
                                id='username'
                                label='Username'
                                autoComplete='username'
                                value={user.username}
                                onChange={this.handleChange}
                                error={errorState}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <FormControl className={classes.formField}>
                            <TextField
                                id='emailAddress'
                                label='Email Address'
                                autoComplete='emailAddress'
                                value={user.emailAddress}
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
                                value={user.password}
                                onChange={this.handleChange}
                                error={passwordsDoNotMatch}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <FormControl className={classes.formField}>
                            <TextField
                                id='confirmPassword'
                                label='Confirm Password'
                                type='password'
                                autoComplete='current-password'
                                value={confirmPassword}
                                onChange={this.handleChange}
                                helperText={passwordsDoNotMatch ?
                                    'do not match' :
                                    undefined}
                                error={passwordsDoNotMatch}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Button
                              className={classes.button}
                              onClick={this.handleRegister}
                          >
                            Register
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
          open={isLoading}
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
