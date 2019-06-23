import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Tooltip, Avatar,
} from '@material-ui/core'
import RepoContributorInfo from 'views/public/contributors/RepoContributorInfo'

const styles = theme => ({
  avatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
})

class ContributorCard extends Component {
  render(){
    const {
      classes,
      repoContributorInfo,
    } = this.props

    console.log('card for:', repoContributorInfo)

    return (
      <div>
        <Tooltip title={repoContributorInfo.githubLoginName}>
          <Avatar
            alt={repoContributorInfo.githubLoginName}
            src={repoContributorInfo.authorInfo.avatar_url}
            className={classes.avatar}
          />
        </Tooltip>
      </div>
    )
  }
}

ContributorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  repoContributorInfo: PropTypes.instanceOf(RepoContributorInfo).isRequired,
}
ContributorCard.defaultProps = {}


const StyledContributorCard = withStyles(styles)(ContributorCard)
export default StyledContributorCard