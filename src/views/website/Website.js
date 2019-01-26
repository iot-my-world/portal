import React from 'react'
import {withStyles} from '@material-ui/core'
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
    container: {
      display: 'grid',
      gridTemplateRows: '60px 200px 146px 76px 1fr',
      gridTemplateColumns: '120px 1fr'
    },
    titleContainer: {
      gridRow: '1/2',
      gridColumn: '2/3',
      alignSelf: 'end',
      fontSize: 24,
      color: '#fff',
      display: 'grid',
      gridTemplateColumns: '35px 133px',
      gridGap: '22px'
    },
    logo: {
      height: '35px',
      width: '35px',
      gridColumn: '1/2',
      alignSelf: 'center',
      justifySelf: 'center'
    },
    title: {
      gridColumn: '2/3',
      alignSelf: 'center',
      justifySelf: 'center'
    },
    descriptionTitle: {
      color: '#009688',
      fontSize: 24,
      alignSelf: 'end',
      gridColumn: '2/3',
    },
    description: {
      gridColumn: '2/3',
      fontSize: 16,
      color: '#fff',
      maxWidth: '384px',
      alignSelf: 'end'
    },
    loginButtonWrapper: {
      gridColumn: '2/3',
      alignSelf: 'end',
      width: '90px',
      height: '36px',
      border: `solid 3px ${'#009688'}`,
      fontSize: 14,
      color: '#fff',
      display: 'grid',
      '&:hover': {
        background: '#cdcdcd',
      }
    },
    loginButton: {
      color: '#fff',
      alignSelf: 'center',
      justifySelf: 'center'
    },
    inputFontStyle: {
    }
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
        <div className={classes.container}>
          <div
              className={classes.titleContainer}
          >
            <img className={classes.logo} src={logo} alt={'logo'}/>
            <div className={classes.title}>
              TRADEBASE
            </div>
          </div>
          <div className={classes.descriptionTitle}>
            FX Dealing & Risk Management Platform
          </div>
          <p className={classes.description}>
            In a world of uncertainty, mitigating risk is of paramount importance. TradeBase
            Dealing ensures
            that the success and profitability of your business is not determined by market
            volatility.
          </p>
          <a className={classes.loginButtonWrapper}
             href='/login-page'
             id='landing_page_login_button'
          >
            <div
                className={classes.loginButton}
            >
              Login
            </div>
          </a>
        </div>
      </div>
  )
}

Website = withStyles(style)(Website)
export default Website
