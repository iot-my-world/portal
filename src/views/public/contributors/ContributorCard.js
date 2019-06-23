import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class ContributorCard extends Component {
  render(){
    return <div>Deivce</div>
  }
}

ContributorCard = withStyles(styles)(ContributorCard)

ContributorCard.propTypes = {}
ContributorCard.defaultProps = {}

export default ContributorCard