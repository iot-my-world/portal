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
import {UserAdministrator} from 'brain/user/human/index'
import {ReasonsInvalid} from 'brain/validate'
import ErrorIcon from '@material-ui/icons/ErrorOutline'
import ReasonInvalid from 'brain/validate/reasonInvalid/ReasonInvalid'

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
    activeState: events.init,
    jwt: '',
    newPassword: '',
    confirmNewPassword: '',
  }
  reasonsInvalid = new ReasonsInvalid()
  resetPasswordClaims

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.renderTokenExpired = this.renderTokenExpired.bind(this)
    this.renderParsingToken = this.renderParsingToken.bind(this)
    this.handleBackToSite = this.handleBackToSite.bind(this)
    this.handleResetPassword = this.handleResetPassword.bind(this)
  }

  handleChange(event) {
    const field = event.target.id

    // check if related field should be cleared
    if (field === 'newPassword') {
      if (
          this.reasonsInvalid.errorOnField('confirmNewPassword') &&
          this.reasonsInvalid.errorOnField('confirmNewPassword').help ===
          'don\'t match'
      ) {
        this.reasonsInvalid.clearField('confirmNewPassword')
      }
    } else if (field === 'confirmNewPassword') {
      if (
          this.reasonsInvalid.errorOnField('newPassword') &&
          this.reasonsInvalid.errorOnField('newPassword').help ===
          'don\'t match'
      ) {
        this.reasonsInvalid.clearField('newPassword')
      }
    }
    this.reasonsInvalid.clearField(field)
    this.setState({[field]: event.target.value})
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
        activeState: events.tokenParsed,
        jwt: jwt,
      })
    } else {
      sessionStorage.setItem('jwt', null)
      this.setState({activeState: events.jwtExpired})
    }
  }

  async handleResetPassword() {
    const {
      newPassword,
      confirmNewPassword,
      jwt,
    } = this.state
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    // blank checks
    if (newPassword === '') {
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'newPassword',
        type: 'blank',
        help: 'can\'t be blank',
        data: newPassword,
      }))
    }
    if (confirmNewPassword === '') {
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'confirmNewPassword',
        type: 'blank',
        help: 'can\'t be blank',
        data: confirmNewPassword,
      }))
    }
    if (this.reasonsInvalid.count > 0) {
      this.forceUpdate()
      return
    }
    // check for that they are the same
    if (newPassword !== confirmNewPassword) {
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'newPassword',
        type: 'invalid',
        help: 'don\'t match',
        data: newPassword,
      }))
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'confirmNewPassword',
        type: 'invalid',
        help: 'don\'t match',
        data: confirmNewPassword,
      }))
    }
    if (this.reasonsInvalid.count > 0) {
      this.forceUpdate()
      return
    }

    ShowGlobalLoader()

    try {
      sessionStorage.setItem('jwt', jwt)
      await UserAdministrator.SetPassword({
        identifier: this.resetPasswordClaims.userId,
        newPassword: newPassword,
      })
      NotificationSuccess('Successfully Reset Password')
    } catch (e) {
      NotificationFailure('Error Setting Password')
      console.error('error setting password: ', e)
    }

    HideGlobalLoader()
    this.handleBackToSite()
  }

  render() {
    const {
      classes,
    } = this.props
    const {
      activeState,
      newPassword,
      confirmNewPassword,
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
                      title={'Reset Password'}
                      titleTypographyProps={{color: 'primary', align: 'center'}}
                  />
                  <CardContent>
                    <form>
                      <Grid container direction={'column'} alignItems={'center'}
                            spacing={1}>
                        <Grid item>
                          <FormControl className={classes.formField}>
                            <TextField
                                type='password'
                                id='newPassword'
                                label='New Password'
                                autoComplete='new-password'
                                value={newPassword}
                                onChange={this.handleChange}
                                helperText={
                                  fieldValidations.newPassword
                                      ? fieldValidations.newPassword.help
                                      : undefined
                                }
                                error={!!fieldValidations.newPassword}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <FormControl className={classes.formField}>
                            <TextField
                                type='password'
                                id='confirmNewPassword'
                                label='Confirm New'
                                autoComplete='new-password'
                                value={confirmNewPassword}
                                onChange={this.handleChange}
                                helperText={
                                  fieldValidations.confirmNewPassword
                                      ? fieldValidations.confirmNewPassword.help
                                      : undefined
                                }
                                error={!!fieldValidations.confirmNewPassword}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Button
                              className={classes.button}
                              onClick={this.handleResetPassword}
                          >
                            Reset
                          </Button>
                        </Grid>
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
                        </Typography>
                        Please go Back To Site and Select Forgot Password Again
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
   * Show Global Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global Loader Action Creator
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
