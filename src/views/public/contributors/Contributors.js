import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Avatar, Tooltip,
} from '@material-ui/core'
import RepoContributorInfo from './RepoContributorInfo'

const styles = theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    boxShadow: '0 0 5px 5px black',
    display: 'flex',
    justifyContent: 'center',
    margin: '10px',
  },
  avatar: {
    margin: 10,
    width: 60,
    height: 60,
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
    console.log(this.repoContributors)
    return (
      <div
        className={classes.root}
        style={{
          height: 1000,
        }}
      >
        aweh
        {/*{Object.values(this.contributorSummary).map((summary, idx) => (*/}
        {/*  <div key={idx}>*/}
        {/*    <Tooltip*/}
        {/*      title={summary.author.login}*/}
        {/*    >*/}
        {/*      <Avatar*/}
        {/*        alt={summary.author.login}*/}
        {/*        src={summary.author.avatar_url}*/}
        {/*        className={classes.avatar}*/}
        {/*      />*/}
        {/*    </Tooltip>*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
    )
  }
}

Contributors = withStyles(styles)(Contributors)

Contributors.propTypes = {}
Contributors.defaultProps = {}

export default Contributors