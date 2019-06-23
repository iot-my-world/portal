import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  Typography,
  withStyles,
  Grid,
} from '@material-ui/core'
import RepoContributorInfo from './RepoContributorInfo'
import ContributorCard from './ContributorCard'

const styles = theme => ({
  root: {
    display: 'flex',
    margin: '10px',
    flexDirection: 'column',
  },
  heading: {
    color: theme.palette.primary.contrastText,
  },
  body: {
    color: theme.palette.primary.contrastText,
  },
  info: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    boxShadow: '0 0 5px 5px black',
    padding: '5px',
  },
})

const githubRepos = [
  'brain',
  'portal',
  'surgeon',
  'chamber',
  'sigbug',
]

class Contributors extends Component {
  state = {
    loading: false,
  }

  componentDidMount() {
    this.load()
  }

  /**
   * Repo contributor info objects mapped by
   * github login name
   * @type {{string, ContributorInfo[]}}
   */
  repoContributors = {}

  repoContributorData = {}

  load = async () => {
    this.setState({loading: true})
    try {
      // load all repo data
      for (let repo of githubRepos) {
        const fetchResult = await fetch(
          `https://api.github.com/repos/iot-my-world/${repo}/stats/contributors`,
          {
            method: 'GET',
            headers: new Headers({}),
            mode: 'cors',
          },
        )
        this.repoContributorData[repo] = await fetchResult.json()
      }
      // build contributor summary
      for (let repo in this.repoContributorData) {
        for (let contributorData of this.repoContributorData[repo]) {
          if (!this.repoContributors[contributorData.author.login]) {
            this.repoContributors[contributorData.author.login] =
              new RepoContributorInfo(contributorData.author)
          }
          this.repoContributors[contributorData.author.login].addRepoContributionInfo(
            repo,
            contributorData,
          )
        }
      }
    } catch (e) {
      console.error('loading error', e)
    }
    this.setState({loading: false})
  }

  render() {
    const {classes} = this.props

    return (
      <div className={classes.root}>
        <div className={classes.info}>
          <Typography
            variant={'h5'}
            align={'center'}
            className={classes.heading}
          >
            Contributors
          </Typography>
          <Typography
            variant={'body1'}
            align={'justify'}
            className={classes.body}
            paragraph
          >
            Cumulative contributions to the master branch (excluding merge
            commits) of each repository in the IOT My World project.
          </Typography>
        </div>
        <Grid container spacing={1}>
          {Object.values(this.repoContributors).sort(
            (a, b) => b.commitTotal - a.commitTotal,
          ).map((contributorInfo, idx) => (
            <Grid
              item
              key={idx}
              md={6}
              xs={12}
            >
              <ContributorCard
                repoContributorInfo={contributorInfo}
                rank={idx + 1}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }
}

Contributors = withStyles(styles)(Contributors)

Contributors.propTypes = {}
Contributors.defaultProps = {}

export default Contributors