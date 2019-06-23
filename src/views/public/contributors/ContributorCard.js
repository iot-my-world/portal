import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Tooltip, Avatar,
  Card, CardContent,
} from '@material-ui/core'
import RepoContributorInfo from 'views/public/contributors/RepoContributorInfo'

const styles = theme => ({
  avatar: {
    width: 55,
    height: 55,
  },
  cardRoot: {
    margin: '5px 0px 5px 0px',
  },
  cardContentRoot: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
  },
  infoLayout: {
    display: 'grid',
    gridTemplateRows: 'auto',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  contributionInfoLayout: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: 'auto auto',
  },
  gitHubName: {

  },
  rank: {
    justifySelf: 'end',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  commits: {

  },
  additionsAndDeletionsLayout: {
    justifySelf: 'end',
    display: 'grid',
    gridTemplateRows: 'auto',
    gridTemplateColumns: 'auto auto',
    gridColumnGap: '5px',
  },
  additions: {
    color: '#3bff10',
  },
  deletions: {
    color: '#ff0c0e',
  },
})

class ContributorCard extends Component {
  render() {
    const {
      classes,
      repoContributorInfo,
      rank,
    } = this.props

    return (
      <Card classes={{root: classes.cardRoot}}>
        <CardContent classes={{root: classes.cardContentRoot}}>
          <div className={classes.infoLayout}>
            <Avatar
              alt={repoContributorInfo.githubLoginName}
              src={repoContributorInfo.authorInfo.avatar_url}
              className={classes.avatar}
            />
            <div className={classes.contributionInfoLayout}>
              <div className={classes.gitHubName}>
                {repoContributorInfo.githubLoginName}
              </div>
              <div className={classes.rank}>
                {`#${rank}`}
              </div>
              <div className={classes.commits}>
                {`Commits: ${repoContributorInfo.commitTotal}`}
              </div>
              <div className={classes.additionsAndDeletionsLayout}>
                <div className={classes.additions}>
                  {`${repoContributorInfo.additionsTotal}+`}
                </div>
                <div className={classes.deletions}>
                  {`${repoContributorInfo.deletionsTotal}-`}
                </div>
              </div>
            </div>
          </div>
          <div>
            awe
          </div>
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