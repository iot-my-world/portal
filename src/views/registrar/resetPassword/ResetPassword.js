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
import {
  User as UserEntity,
} from 'brain/user'
import {ReasonsInvalid} from 'brain/validate'
import ErrorIcon from '@material-ui/icons/ErrorOutline'
import {
  RegisterCompanyAdminUser, RegisterCompanyUser,
  RegisterClientAdminUser, RegisterClientUser,
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
    progressSpinnerDialog: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      overflow: 'hidden',
    },
    progressSpinnerDialogBackdrop: {
      // backgroundColor: 'transparent',
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

class ResetPassword extends Component {

  state = {
    isLoading: false,
    activeState: events.init,
    jwt: '',
  }
  reasonsInvalid = new ReasonsInvalid()
  resetPasswordClaims

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.renderTokenExpired = this.renderTokenExpired.bind(this)
    this.renderParsingToken = this.renderParsingToken.bind(this)
    this.handleBackToSite = this.handleBackToSite.bind(this)
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
    let resetPasswordClaims
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
      resetPasswordClaims = parseToken(jwt)
    } catch (e) {
      console.error(`error parsing token to claims: ${e}`)
      this.handleBackToSite()
      return
    }
    // if the claims are not expired
    if (resetPasswordClaims.notExpired) {
      // store the token to be used on registration api
      this.resetPasswordClaims = resetPasswordClaims
      this.setState({
        // set up the user from the claims
        user: new UserEntity(resetPasswordClaims.user),
        activeState: events.tokenParsed,
        jwt: jwt,
      })
    } else {
      sessionStorage.setItem('jwt', null)
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
              SpotNav
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
                            spacing={8}>
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
              SpotNav
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
                        spacing={8}
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

let StyledLogin = withStyles(style)(ResetPassword)

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
   * redux state flag indicating if the app
   * is logged in
   */
  loggedIn: PropTypes.bool.isRequired,
  Logout: PropTypes.func.isRequired,
}
export default StyledLogin
