import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Avatar,
  Card, CardContent,
} from '@material-ui/core'
import withWidth, {isWidthUp} from '@material-ui/core/withWidth/withWidth'
import RepoContributorInfo from 'views/public/contributors/RepoContributorInfo'
import {
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import moment from 'moment'

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
    gridRowGap: '15px',
  },
  infoLayout: {
    display: 'grid',
    gridTemplateRows: 'auto',
    gridTemplateColumns: 'auto 1fr',
    gridColumnGap: '5px',
    alignItems: 'center',
  },
  contributionInfoLayout: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: 'auto auto',
  },
  gitHubName: {
  },
  link: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  rank: {
    justifySelf: 'end',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  commits: {},
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
  chartLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto',
    justifyItems: 'center',
  },
})

class ContributorCard extends Component {

  state = {
    // chart width and height set to safe minimums
    chartWidth: 200,
    chartHeight: 150,
  }

  setChartDimensions = element => {
    const {
      chartWidth,
      chartHeight,
    } = this.state
    const {
     theme,
     width,
    } = this.props

    if (!(chartWidth === 200 || chartHeight === 100)) {
      // chart width and height already set, don't do it
      // again
      return
    }

    // check if NOT mobile
    if (isWidthUp('md', width)) {
      // if not mobile, set with to max allowed
      this.setState({
        chartWidth: (window.innerWidth / 2) - 4*theme.spacing(2),
        chartHeight: window.innerHeight / 4,
      })
      return
    }

    // otherwise this is mobile, auto set the width and height
    try {
      this.setState({
        chartWidth: element.parentElement.clientWidth - 2*theme.spacing(2),
        chartHeight: window.innerHeight / 4,
      })
    } catch (e) {
    }
  }

  render() {
    const {
      classes,
      repoContributorInfo,
      rank,
    } = this.props
    const {
      chartWidth,
      chartHeight,
    } = this.state

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
                <a
                  href={repoContributorInfo.authorInfo.html_url}
                  target={'_blank'}
                  className={classes.link}
                >
                  {repoContributorInfo.githubLoginName}
                </a>
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
          <div
            className={classes.chartLayout}
            ref={this.setChartDimensions}
          >
            <AreaChart
              width={chartWidth} height={chartHeight}
              data={repoContributorInfo.weeklyTotals}
              margin={{top: 0, right: 0, left: -8, bottom: 0}}
            >
              <XAxis
                dataKey={'weekTimestamp'}
                type={'number'}
                scale={'time'}
                domain={['dataMin', 'dataMax']}
                tick={TimeTick}
              />
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip
                labelFormatter={value =>
                  moment.unix(value).format('MMM Do YYYY')
                }
                formatter={(value) => ([value, 'Additions'])}
              />
              <Area
                type='monotone'
                dataKey='total.a'
              />
            </AreaChart>
          </div>
        </CardContent>
      </Card>
    )
  }
}

const TimeTick = props => {
  const {
    x, y,
    // stroke,
    payload,
  } = props

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dx={10}
        dy={16}
        textAnchor="end"
        fill="#666"
        // transform="rotate(-25)"
      >
        {moment.unix(payload.value).format('MMM-YY')}
      </text>
    </g>
  )
}

ContributorCard.propTypes = {
  width: PropTypes.string,
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  repoContributorInfo: PropTypes.instanceOf(RepoContributorInfo).isRequired,
  rank: PropTypes.number.isRequired,
}
ContributorCard.defaultProps = {}

const StyledContributorCard = withWidth()(withStyles(styles, {withTheme: true})(ContributorCard))
export default StyledContributorCard