import React from 'react'
import {
  withStyles, Typography
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
    titleOuterWrapper: {
      
    },
    titleInnerWrapper: {
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gridTemplateRows: 'auto',
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
  }
}

let Website = props => {
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
          <div className={classes.titleOuterWrapper}>
            <div
                className={classes.titleInnerWrapper}
            >
              <img className={classes.logo} src={logo} alt={'logo'}/>
              <Typography className={classes.title} color={'primary'} variant={'h3'}>
                TRIPSYNC
              </Typography>
            </div>
          </div>
        </div>
      </div>
  )
}

Website = withStyles(style)(Website)
export default Website
