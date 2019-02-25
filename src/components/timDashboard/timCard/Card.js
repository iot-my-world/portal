import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'
import {
  blackColor,
  whiteColor,
  hexToRgb,
} from 'components/timDashboard/timDashboard'

const cardStyle = {
  card: {
    border: '0',
    marginBottom: '30px',
    marginTop: '30px',
    borderRadius: '6px',
    color: 'rgba(' + hexToRgb(blackColor) + ', 0.87)',
    background: whiteColor,
    width: '100%',
    boxShadow: '0 1px 4px 0 rgba(' + hexToRgb(blackColor) + ', 0.14)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    wordWrap: 'break-word',
    fontSize: '.875rem',
  },
  cardPlain: {
    background: 'transparent',
    boxShadow: 'none',
  },
  cardProfile: {
    marginTop: '30px',
    textAlign: 'center',
  },
  cardChart: {
    '& p': {
      marginTop: '0px',
      paddingTop: '0px',
    },
  },
}

function Card({...props}) {
  const {
    classes,
    className,
    children,
    plain,
    profile,
    chart,
    ...rest
  } = props
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardProfile]: profile,
    [classes.cardChart]: chart,
    [className]: className !== undefined,
  })
  return (
      <div className={cardClasses} {...rest}>
        {children}
      </div>
  )
}

Card.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  chart: PropTypes.bool,
}

export default withStyles(cardStyle)(Card)
