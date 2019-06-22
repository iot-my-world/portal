import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Avatar, Tooltip,
} from '@material-ui/core'

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

  repoContributorData = {}
  contributorSummary = {}

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
          if (!this.contributorSummary.hasOwnProperty(contributorData.author.login)) {
            this.contributorSummary[contributorData.author.login] = {
              author: contributorData.author,
            }
          }
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
      <div
        className={classes.root}
        style={{
          height: 1000,
        }}
      >
        {Object.values(this.contributorSummary).map((summary, idx) => (
          <div key={idx}>
            <Tooltip
              title={summary.author.login}
            >
              <Avatar
                alt={summary.author.login}
                src={summary.author.avatar_url}
                className={classes.avatar}
              />
            </Tooltip>
          </div>
        ))}
      </div>
    )
  }
}

Contributors = withStyles(styles)(Contributors)

Contributors.propTypes = {}
Contributors.defaultProps = {}

export default Contributors