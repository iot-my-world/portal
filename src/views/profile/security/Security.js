import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader,
  Grid, TextField,
  withStyles,
  Typography, Fab, Tooltip,
} from '@material-ui/core'
import {FaKey as KeyIcon} from 'react-icons/fa'
import {
  MdEdit as EditIcon,
} from 'react-icons/md'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const styles = theme => ({
  securityItemWrapper: {
    margin: 2,
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
  },
  icon: {
    color: theme.palette.text.secondary,
    paddingRight: 5,
  },
  button: {
    margin: theme.spacing.unit,
  },
})

class Security extends Component {

  constructor(props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: '',
    }
  }

  reasonsInvalid = new ReasonsInvalid()

  render() {
    const {classes} = this.props
    const {password, confirmPassword} = this.state

    const fieldValidations = this.reasonsInvalid.toMap()

    return <Grid container direction='column' spacing={8} alignItems='center'>
      <Grid item>
        <Card className={classes.detailCard}>
          <CardContent>
            <Grid container direction='column' spacing={8}
                  alignItems={'center'}>
              <Grid item>
                <div className={classes.securityItemWrapper}>
                  <KeyIcon className={classes.icon}/>
                  <div style={{justifySelf: 'start'}}>
                    <Typography variant={'subtitle1'} color={'textPrimary'}>
                      Change Password
                    </Typography>
                  </div>
                  <div style={{gridColumn: '1/3', gridRow: '2/3'}}>
                    <Typography variant={'caption'} color={'textSecondary'}>
                      It's a good idea to use a strong password that you're not
                      using elsewhere
                    </Typography>
                  </div>
                  <div style={{gridColumn: '3/4', gridRow: '1/3'}}>
                    <Fab
                        color={'primary'}
                        className={classes.button}
                        size={'small'}
                    >
                      <Tooltip title='Edit'>
                        <EditIcon className={classes.buttonIcon}/>
                      </Tooltip>
                    </Fab>
                  </div>
                </div>
              </Grid>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id='password'
                    label='Password'
                    value={password}
                    InputProps={{
                      disableUnderline: true,
                      readOnly: true,
                    }}
                    // onChange={this.handleFieldChange}
                    // disabled={disableFields}
                    // helperText={
                    //   fieldValidations.emailAddress
                    //       ? fieldValidations.emailAddress.help
                    //       : undefined
                    // }
                    // error={!!fieldValidations.emailAddress}
                />
              </Grid>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id='confirmPassword'
                    label='Confirm Password'
                    value={password}
                    InputProps={{
                      disableUnderline: true,
                      readOnly: true,
                    }}
                    // onChange={this.handleFieldChange}
                    // disabled={disableFields}
                    // helperText={
                    //   fieldValidations.emailAddress
                    //       ? fieldValidations.emailAddress.help
                    //       : undefined
                    // }
                    // error={!!fieldValidations.emailAddress}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  }
}

Security = withStyles(styles)(Security)

Security.propTypes = {}
Security.defaultProps = {}

export default Security