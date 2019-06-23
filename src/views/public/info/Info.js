import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Typography,
} from '@material-ui/core'

const styles = theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    boxShadow: '0 0 5px 5px black',
    display: 'grid',
    margin: '10px',
    padding: '5px',
    gridTemplateRows: '1fr',
  },
  heading: {
    color: theme.palette.primary.contrastText,
  },
  body: {
    color: theme.palette.primary.contrastText,
  },
})

class Info extends Component {
  render() {
    const {
      classes,
    } = this.props
    return (
      <div className={classes.root}>
        <Typography
          variant={'h5'}
          className={classes.heading}
        >
          What is this?
        </Typography>
        <Typography
          variant={'body1'}
          align={'justify'}
          className={classes.body}
          paragraph
        >
          IOT My World is an open source project born out of a passion for all
          things IOT. The goal is the connection of everything which can be and
          the furtherment of the IOT World.

          Building an IOT device is hard. Building an IOT device as well as an
          entire online platform is even harder. This project is an effort to
          address both of these challenges.
        </Typography>
        <Typography
          variant={'h5'}
          className={classes.heading}
        >
          The Devices
        </Typography>
        <Typography
          variant={'body1'}
          align={'justify'}
          className={classes.body}
          paragraph
        >
          As devices are created their complete source code and hardware design
          will be released under an appropriate open source license. The idea is
          that anyone interested can build one of the devices and connect it to
          this platform themselves. Alternatively, they may use the designs as
          inspiration and create something new. While open source devices are
          preferred, this will not be a restriction.
        </Typography>
        <Typography
          variant={'h5'}
          className={classes.heading}
        >
          The Platform
        </Typography>
        <Typography
          variant={'body1'}
          align={'justify'}
          className={classes.body}
          paragraph
        >
          The platform's back end is a set of microservices that can be accessed
          via a secure JSON-RPC API. At it’s core is a user management system
          with individual, company and client accounts. The front end is a
          responsive React.js single page web application. All parts of the
          platform are open source and released under AGPL-3.0.
        </Typography>
        <Typography
          variant={'h5'}
          className={classes.heading}
        >
          Account Types
        </Typography>
        <Typography
          variant={'body1'}
          align={'justify'}
          className={classes.body}
          paragraph
        >
          An individual account is registered to a single user.

          A company account can have multiple users and multiple client accounts
          each with multiple users. It starts off with a single admin user who
          can add and invite more users with the same or restricted privileges.
          Company admin users can add Client Accounts. The Client accounts
          similarly start off with a single admin user who has the ability to
          add and invite users.
        </Typography>
      </div>
    )
  }
}

Info = withStyles(styles)(Info)

Info.propTypes = {}
Info.defaultProps = {}

export default Info