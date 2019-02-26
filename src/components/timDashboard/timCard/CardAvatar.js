import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'
import {blackColor, hexToRgb} from 'components/timDashboard/timDashboard'

const cardAvatarStyle = {
  cardAvatar: {
    '&$cardAvatarProfile img': {
      width: '100%',
      height: 'auto',
    },
  },
  cardAvatarProfile: {
    maxWidth: '130px',
    maxHeight: '130px',
    margin: '-50px auto 0',
    borderRadius: '50%',
    overflow: 'hidden',
    padding: '0',
    boxShadow:
        '0 16px 38px -12px rgba(' +
        hexToRgb(blackColor) +
        ', 0.56), 0 4px 25px 0px rgba(' +
        hexToRgb(blackColor) +
        ', 0.12), 0 8px 10px -5px rgba(' +
        hexToRgb(blackColor) +
        ', 0.2)',
    '&$cardAvatarPlain': {
      marginTop: '0',
    },
  },
  cardAvatarPlain: {},
}

function CardAvatar({...props}) {
  const {classes, children, className, plain, profile, ...rest} = props
  const cardAvatarClasses = classNames({
    [classes.cardAvatar]: true,
    [classes.cardAvatarProfile]: profile,
    [classes.cardAvatarPlain]: plain,
    [className]: className !== undefined,
  })
  return (
      <div className={cardAvatarClasses} {...rest}>
        {children}
      </div>
  )
}

CardAvatar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  profile: PropTypes.bool,
  plain: PropTypes.bool,
}

export default withStyles(cardAvatarStyle)(CardAvatar)
