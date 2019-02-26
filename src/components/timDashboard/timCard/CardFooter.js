import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'
import {grayColor} from 'components/timDashboard/timDashboard'

const cardFooterStyle = {
  cardFooter: {
    padding: '0',
    paddingTop: '10px',
    margin: '0 15px 10px',
    borderRadius: '0',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'transparent',
    border: '0'
  },
  cardFooterProfile: {
    marginTop: '-15px'
  },
  cardFooterPlain: {
    paddingLeft: '5px',
    paddingRight: '5px',
    backgroundColor: 'transparent'
  },
  cardFooterStats: {
    borderTop: '1px solid ' + grayColor[10],
    marginTop: '20px',
    '& svg': {
      position: 'relative',
      top: '4px',
      marginRight: '3px',
      marginLeft: '3px',
      width: '16px',
      height: '16px'
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      fontSize: '16px',
      position: 'relative',
      top: '4px',
      marginRight: '3px',
      marginLeft: '3px'
    }
  },
  cardFooterChart: {
    borderTop: '1px solid ' + grayColor[10]
  }
}

function CardFooter({ ...props }) {
  const {
    classes,
    className,
    children,
    plain,
    profile,
    stats,
    chart,
    ...rest
  } = props
  const cardFooterClasses = classNames({
    [classes.cardFooter]: true,
    [classes.cardFooterPlain]: plain,
    [classes.cardFooterProfile]: profile,
    [classes.cardFooterStats]: stats,
    [classes.cardFooterChart]: chart,
    [className]: className !== undefined
  })
  return (
    <div className={cardFooterClasses} {...rest}>
      {children}
    </div>
  )
}

CardFooter.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  stats: PropTypes.bool,
  chart: PropTypes.bool
}

export default withStyles(cardFooterStyle)(CardFooter)
