import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Tooltip, Avatar,
  Card, CardContent,
} from '@material-ui/core'
import RepoContributorInfo from 'views/public/contributors/RepoContributorInfo'

const styles = theme => ({
  avatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  cardRoot: {
    margin: '5px 0px 5px 0px'
  },
})

class ContributorCard extends Component {
  render(){
    const {
      classes,
      repoContributorInfo,
    } = this.props

    console.log('card for:', repoContributorInfo)
    console.log('commit total:', repoContributorInfo.commitTotal)
    console.log('additions total:', repoContributorInfo.additionsTotal)
    console.log('deletions total:', repoContributorInfo.deletionsTotal)

    return (
      <Card classes={{root: classes.cardRoot}}>
        <CardContent>
          <Avatar
            alt={repoContributorInfo.githubLoginName}
            src={repoContributorInfo.authorInfo.avatar_url}
            className={classes.avatar}
          />
        </CardContent>
      </Card>
    )
  }
}

ContributorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  repoContributorInfo: PropTypes.instanceOf(RepoContributorInfo).isRequired,
  rank: PropTypes.number.isRequired,
}
ContributorCard.defaultProps = {}


const StyledContributorCard = withStyles(styles)(ContributorCard)
export default StyledContributorCard