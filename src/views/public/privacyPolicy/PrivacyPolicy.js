import React from 'react'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

function PrivacyPolicy(props) {
  return (
    <div>
      Privacy Policy!
    </div>
  )
}

const StyledPrivacyPolicy = withStyles(styles)(PrivacyPolicy)

export default StyledPrivacyPolicy