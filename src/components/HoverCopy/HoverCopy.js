import React, {useRef, useState} from 'react'
import PropTypes from 'prop-types'
import {Icon, IconButton, Tooltip, makeStyles} from '@material-ui/core'
import {CopyIcon} from 'components/icon'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  value: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  buttonRoot: {
    padding: 0,
    margin: `${theme.spacing(0.5)} 0 0 ${theme.spacing(0.5)}`,
  },
}))

function HoverCopy(props) {
  const {
    value,
    maxWidth,
  } = props
  const [showCopy, setShowCopy] = useState(false)
  const [showCopiedText, setShowCopiedText] = useState(false)
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

        setShowCopiedText(true)
        setTimeout(()=>setShowCopiedText(false), 1000)
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
        style={{
          maxWidth,
        }}
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
            title={showCopiedText ? 'Copied!' : 'Copy'}
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
  /**
   * textual value to be shown and
   * copied
   */
  value: PropTypes.string,
  /**
   * max width of text before truncation
   * with ellipses
   */
  maxWidth: PropTypes.number,
}

HoverCopy.defaultProps = {
  value: '',
  maxValue: 100,
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

