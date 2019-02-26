import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

// core components
const cardBodyStyle = {
  cardBody: {
    padding: '0.9375rem 20px',
    flex: '1 1 auto',
    WebkitBoxFlex: '1',
    position: 'relative'
  },
  cardBodyPlain: {
    paddingLeft: '5px',
    paddingRight: '5px'
  },
  cardBodyProfile: {
    marginTop: '15px'
  }
}

function CardBody({ ...props }) {
  const { classes, className, children, plain, profile, ...rest } = props
  const cardBodyClasses = classNames({
    [classes.cardBody]: true,
    [classes.cardBodyPlain]: plain,
    [classes.cardBodyProfile]: profile,
    [className]: className !== undefined
  })
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  )
}

CardBody.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool
}

export default withStyles(cardBodyStyle)(CardBody)
