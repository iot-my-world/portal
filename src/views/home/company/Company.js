import React, {Component} from 'react'
import {
  TimCard, TimCardHeader, TimCardBody,
} from 'components/timDashboard/timCard'

// import PropTypes from 'prop-types'
import {
  withStyles, Grid
} from '@material-ui/core'
import {grayColor} from 'components/timDashboard/timDashboard'

const styles = theme => ({
  cardCategory: {
    color: grayColor[0],
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    paddingTop: '10px',
    marginBottom: '0'
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: 'Roboto',
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1'
    }
  },
})

class Company extends Component {
  render() {
    const {
      classes,
    } = this.props

    return <Grid container direction='column'>
      <Grid item xs={12}>
        <Grid container>
          asdf
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item>
            <TimCard chart>
              <TimCardHeader color='success'>
                Chart picture
              </TimCardHeader>
              <TimCardBody>
                <h4 className={classes.cardTitle}>Daily Sales</h4>
                <p className={classes.cardCategory}>
                  Some text
                </p>
              </TimCardBody>
            </TimCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  }
}

Company = withStyles(styles)(Company)

Company.propTypes = {

}

Company.defaultProps = {
  
}

export default Company