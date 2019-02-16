import React from 'react'
import {
  withStyles, Typography,
  Card, CardContent, CardHeader,
} from '@material-ui/core'
import backgroundImage from 'assets/images/websiteBackground.jpg'
import logo from 'assets/images/logo.png'
import {ScaleLoader as Spinner} from 'react-spinners'

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
    cardHeaderRoot: {
      paddingBottom: 0,
    },
    loadingAppCardContent: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      justifyItems: 'center'
    }
  }
}

let LoadingScreen = props => {
    const {
      classes,
    } = props

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
                  title={'Loading App'}
                  titleTypographyProps={{color: 'primary', align: 'center'}}
                  classes={{root: classes.cardHeaderRoot}}
              />
              <CardContent>
                <div className={classes.loadingAppCardContent}>
                  <Spinner isLoading/>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
}

let StyledLoadingScreen = withStyles(style)(LoadingScreen)

export default StyledLoadingScreen
