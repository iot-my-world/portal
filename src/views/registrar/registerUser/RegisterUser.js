import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Typography,
  Card, CardContent, Grid,
  TextField, Button,
  FormControl, CardHeader,
} from '@material-ui/core'
import backgroundImage from 'assets/images/largeWebsiteBackground.jpg'
import logo from 'assets/images/logo/logo_emblem.png'
import {parseToken} from 'utilities/token'
import {
  User as UserEntity,
  UserValidator,
} from 'brain/user/human/index'
import {ReasonsInvalid} from 'brain/validate'
import ErrorIcon from '@material-ui/icons/ErrorOutline'
import {
  RegisterCompanyAdminUserClaimsType, RegisterCompanyUserClaimsType,
  RegisterClientAdminUserClaimsType, RegisterClientUserClaimsType,
} from 'brain/security/claims/types'
import {PartyRegistrar} from 'brain/party/registrar'

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
    cardHeaderRoot: {
      paddingBottom: 0,
    },
    formField: {
      width: '200px',
    },
    loginCardWrapper: {},
    button: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
    errorIcon: {
      fontSize: 100,
      color: theme.palette.error.main,
    },
  }
}

const states = {
  nop: 0,
  parsingToken: 1,
  invalidURL: 2,
  tokenExpired: 3,
  passwordsDoNotMatch: 4,
}

const events = {
  init: states.parsingToken,
  jwtExpired: states.tokenExpired,
  passwordsDoNotMatch: states.passwordsDoNotMatch,
  tokenParsed: states.nop,
  reInit: states.nop,
}

class RegisterUser extends Component {

  state = {
    activeState: events.init,
    user: new UserEntity(),
    confirmPassword: '',
    jwt: '',
  }
  reasonsInvalid = new ReasonsInvalid()
  registrationClaims

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
    this.renderTokenExpired = this.renderTokenExpired.bind(this)
    this.renderParsingToken = this.renderParsingToken.bind(this)
    this.handleBackToSite = this.handleBackToSite.bind(this)
    this.passwordMessage = this.passwordMessage.bind(this)
  }

  handleChange(event) {
    let {
      user,
    } = this.state
    const {
      activeState,
    } = this.state
    this.reasonsInvalid.clearField(event.target.id)
    if (event.target.id === 'confirmPassword') {
      this.setState({confirmPassword: event.target.value})
    } else {
      user[event.target.id] = event.target.value
      // this.reasonsInvalid.clearField(event.target.id)
      this.setState({user})
    }
    if (
        (
            (activeState === states.passwordsDoNotMatch) ||
            (activeState === states.passwordBlank)
        ) &&
        (
            (event.target.id === 'confirmPassword') ||
            (event.target.id === 'password')
        )
    ) {
      this.setState({activeState: events.reInit})
    }
  }

  async handleRegister() {
    const {
      user,
      confirmPassword,
      jwt,
    } = this.state
    const {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
    } = this.props

    // confirm that password is entered correctly
    if (user.password !== confirmPassword) {
      this.setState({activeState: events.passwordsDoNotMatch})
      return
    }

    // set the jwt in session storage if not set yet
    if (
        (sessionStorage.getItem('jwt') === 'null') ||
        !sessionStorage.getItem('jwt')
    ) {
      sessionStorage.setItem('jwt', jwt)
    }

    ShowGlobalLoader()

    // validate the new user for create
    let reasonsInvalid
    try {
      switch (this.registrationClaims.type) {
        case RegisterCompanyAdminUserClaimsType:
          reasonsInvalid = (await UserValidator.Validate({
            user,
            action: 'RegisterCompanyAdminUser',
          })).reasonsInvalid
          break

        case RegisterCompanyUserClaimsType:
          reasonsInvalid = (await UserValidator.Validate({
            user,
            action: 'RegisterCompanyUser',
          })).reasonsInvalid
          break

        case RegisterClientAdminUserClaimsType:
          reasonsInvalid = (await UserValidator.Validate({
            user,
            action: 'RegisterClientAdminUser',
          })).reasonsInvalid
          break

        case RegisterClientUserClaimsType:
          reasonsInvalid = (await UserValidator.Validate({
            user,
            action: 'RegisterClientUser',
          })).reasonsInvalid
          break

        default:
          throw new TypeError(
              'invalid claims type: ' + this.registrationClaims.type)
      }
    } catch (error) {
      console.error('Error Validating User', error)
      NotificationFailure('Error Validating User')
      HideGlobalLoader()
      return
    }

    // if no reasons invalid then register
    try {
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
      } else {
        switch (this.registrationClaims.type) {
          case RegisterCompanyAdminUserClaimsType:
            await PartyRegistrar.RegisterCompanyAdminUser({user})
            break

          case RegisterCompanyUserClaimsType:
            await PartyRegistrar.RegisterCompanyUser({user})
            break

          case RegisterClientAdminUserClaimsType:
            await PartyRegistrar.RegisterClientAdminUser({user})
            break

          case RegisterClientUserClaimsType:
            await PartyRegistrar.RegisterClientUser({user})
            break

          default:
            throw new TypeError(
                'invalid claims type: ' + this.registrationClaims.type)
        }
        NotificationSuccess('Successfully Registered User')
        HideGlobalLoader()
        this.handleBackToSite()
      }
    } catch (error) {
      console.error('Error Registering User', error)
      NotificationFailure('Error Registering User')
      HideGlobalLoader()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      loggedIn,
      Logout,
    } = this.props

    if (loggedIn) {
      Logout()
    }

  }

  handleBackToSite() {
    const {
      history,
    } = this.props
    sessionStorage.setItem('jwt', null)
    history.push('/')
  }

  componentDidMount() {
    const {
      location,
      Logout,
    } = this.props

    Logout()

    let jwt
    let registrationClaims
    try {
      jwt = (new URLSearchParams(location.search)).get('t')
      if (!jwt) {
        console.error(`jwt is null`)
        this.handleBackToSite()
        return
      }
    } catch (e) {
      console.error(`error parsing url: ${e}`)
      this.handleBackToSite()
      return
    }
    try {
      // parse the registration claims
      registrationClaims = parseToken(jwt)
    } catch (e) {
      console.error(`error parsing token to claims: ${e}`)
      this.handleBackToSite()
      return
    }
    // if the claims are not expired
    if (registrationClaims.notExpired) {
      // store the token to be used on registration api
      this.registrationClaims = registrationClaims
      this.setState({
        // set up the user from the claims
        user: new UserEntity(registrationClaims.user),
        activeState: events.tokenParsed,
        jwt: jwt,
      })
    } else {
      sessionStorage.setItem('jwt', null)
      this.setState({activeState: events.jwtExpired})
    }
  }

  passwordMessage() {
    const {
      activeState,
    } = this.state

    const passwordError = this.reasonsInvalid.errorOnField('password')
    if (passwordError) {
      return passwordError.help
    }

    switch (activeState) {
      case states.passwordsDoNotMatch:
        return 'do not match'
      case states.passwordBlank:
        return 'cannot be blank'
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
      user,
      confirmPassword,
    } = this.state

    switch (activeState) {
      case states.tokenExpired:
        return this.renderTokenExpired()
      case states.parsingToken:
        return this.renderParsingToken()
      default:
    }

    if (activeState === states.tokenExpired) {
      return this.renderTokenExpired()
    }

    const fieldValidations = this.reasonsInvalid.toMap()

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
              IOT My World
            </Typography>
          </div>
          <div className={classes.loginCardWrapper}>
            <Grid container>
              <Grid item>
                <Card>
                  <CardHeader
                      classes={{root: classes.cardHeaderRoot}}
                      title={'User Registration'}
                      titleTypographyProps={{color: 'primary', align: 'center'}}
                  />
                  <CardContent>
                    <form>
                      <Grid container direction={'column'} alignItems={'center'}
                            spacing={1}>
                        <Grid item>
                          <FormControl className={classes.formField}>
                            <TextField
                                id='name'
                                label='Name'
                                autoComplete='name'
                                value={user.name}
                                onChange={this.handleChange}
                                helperText={
                                  fieldValidations.name
                                      ? fieldValidations.name.help
                                      : undefined
                                }
                                error={!!fieldValidations.name}
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
                                helperText={
                                  fieldValidations.surname
                                      ? fieldValidations.surname.help
                                      : undefined
                                }
                                error={!!fieldValidations.surname}
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
                                helperText={
                                  fieldValidations.username
                                      ? fieldValidations.username.help
                                      : undefined
                                }
                                error={!!fieldValidations.username}
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
                                InputProps={{
                                  readOnly: true,
                                  disableUnderline: true,
                                }}
                                helperText={
                                  fieldValidations.emailAddress
                                      ? fieldValidations.emailAddress.help
                                      : undefined
                                }
                                error={!!fieldValidations.emailAddress}
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
                                helperText={this.passwordMessage()}
                                error={!!this.passwordMessage()}
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
                                helperText={this.passwordMessage()}
                                error={!!this.passwordMessage()}
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
    </div>
  }

  renderTokenExpired() {
    const {
      classes,
    } = this.props
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
              IOT My World
            </Typography>
          </div>
          <div className={classes.loginCardWrapper}>
            <Grid container>
              <Grid item>
                <Card>
                  <CardHeader
                      classes={{root: classes.cardHeaderRoot}}
                      title={'Expired'}
                      titleTypographyProps={{color: 'error', align: 'center'}}
                  />
                  <CardContent>
                    <Grid
                        container
                        direction='column'
                        spacing={1}
                        alignItems={'center'}
                    >
                      <Grid item>
                        <ErrorIcon className={classes.errorIcon}/>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Please contact your administrator to get a new
                          registration link
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                            className={classes.button}
                            onClick={this.handleBackToSite}
                        >
                          Back To Site
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  }

  renderParsingToken() {
    const {
      classes,
    } = this.props
    return <div
        className={classes.fullPageBackground}
        style={{backgroundImage: 'url(' + backgroundImage + ')'}}
    />
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
  /**
   * Show Global App Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global App Loader Action Creator
   */
  HideGlobalLoader: PropTypes.func.isRequired,
  /**
   * redux state flag indicating if the app
   * is logged in
   */
  loggedIn: PropTypes.bool.isRequired,
  Logout: PropTypes.func.isRequired,
}
export default StyledLogin
