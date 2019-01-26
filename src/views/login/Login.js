import React from 'react'
import {
  withStyles, Typography,
  Card, CardContent, Grid,
  TextField, Button,
} from '@material-ui/core'
import backgroundImage from '../../assets/images/websiteBackground.jpg'
import logo from '../../assets/images/logo.png'

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
    loginCardWrapper: {
    },
    button: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
  }
}

let Login = props => {
  const {
    classes
  } = props
  return (
      <div
          className={classes.fullPageBackground}
          style={{backgroundImage: 'url(' + backgroundImage + ')'}}
      >
        <div className={classes.root}>
          <div/>
          <div className={classes.contentWrapper}>
            <div className={classes.titleInnerWrapper}>
              <img className={classes.logo} src={logo} alt={'logo'}/>
              <Typography className={classes.title} color={'primary'} variant={'h3'}>
                TRIPSYNC
              </Typography>
            </div>
            <div className={classes.loginCardWrapper}>
              <Grid container>
                <Grid item>
                  <Card>
                    <CardContent>
                      <Grid container direction={'column'} alignItems={'center'} spacing={8}>
                        <Grid item>
                          <TextField
                              id='emailAddress'
                              label='Email Address'
                              // value={selected.balance}
                              // onChange={this.handleChange('balance')}
                              // error={!!invalidFields['balance']}
                          />
                        </Grid>
                        <Grid item>
                          <TextField
                              id='password'
                              label='Password'
                              type={'password'}
                              // value={selected.balance}
                              // onChange={this.handleChange('balance')}
                              // error={!!invalidFields['balance']}
                          />
                        </Grid>
                        <Grid item>
                          <Button className={classes.button} variant={'primary'}>
                            Login
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
  )
}

Login = withStyles(style)(Login)
export default Login
