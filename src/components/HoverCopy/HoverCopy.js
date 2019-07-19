import React, {useRef, useState} from 'react'
import PropTypes from 'prop-types'
import {Icon, IconButton, Tooltip, makeStyles} from '@material-ui/core'
import {CopyIcon} from 'components/icon'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  inputField: {
    // display: 'none',
    // visibility: 'hidden',
  },
  value: {
    textOverflow: 'ellipsis',
    maxWidth: '80px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  buttonRoot: {
    padding: 0,
    margin: 0,
  },
}))

function HoverCopy(props) {
  const {
    value,
  } = props
  const [showCopy, setShowCopy] = useState(false)
  const classes = useStyles()
  const textElementRef = useRef(null)

  function copy() {
    if (textElementRef && textElementRef.current) {
      try {
        // clear any current selection
        window.getSelection().removeAllRanges()

        // create a new range and add it to current selection
        const range = document.createRange()
        range.selectNode(textElementRef.current)
        window.getSelection().addRange(range)

        // execute copy command
        document.execCommand('copy')

        // clear all selections
        window.getSelection().removeAllRanges()
      } catch (e) {
        console.error('error copying value', e)
      }
    }
  }

  if (document.queryCommandSupported('copy')) {
    return (
      <div
        className={classes.root}
        onMouseEnter={()=>setShowCopy(true)}
        onMouseLeave={()=>setShowCopy(false)}
      >
        <div
          className={classes.value}
          ref={textElementRef}
        >
          {value}
        </div>
        {showCopy &&
        <IconButton
          classes={{root: classes.buttonRoot}}
          onClick={copy}
          size={'small'}
        >
          <Tooltip
            title={'Copy'}
            placement={'top-end'}
          >
            <Icon>
              <CopyIcon/>
            </Icon>
          </Tooltip>
        </IconButton>}
      </div>
    )
  }

  return (
    <div>
      {value}
    </div>
  )
}

HoverCopy.propTypes = {
  value: PropTypes.any,
}

HoverCopy.defaultProps = {
  value: '',
}

export default HoverCopy

/**

 <IconButton
 onClick={copy}
 >
 <Tooltip
 title={'Copy'}
 placement={'top-end'}
 >
 <Icon>
 <AddNewIcon/>
 </Icon>
 </Tooltip>
 </IconButton>

 */

