import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Input, IconButton, MenuItem, Menu,
} from '@material-ui/core'
import {
  TextCriterion,
} from 'brain/search/criterion'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const styles = (theme) => ({})

const ITEM_HEIGHT = 48

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
]

class ListText extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      criterion: new TextCriterion({
        field: props.field,
        text: '',
      }),
    }
  }

  handleChange(event) {
    let {
      criterion,
    } = this.state
    const {
      onChange,
    } = this.props

    criterion.text = event.target.value
    this.setState({criterion})

    if (criterion.blank) {
      onChange(criterion.field, undefined)
    } else {
      onChange(criterion.field, criterion)
    }
  }

  handleClick = event => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  render() {
    const {
      criterion,
    } = this.state

    // return <div>
    //   <Input
    //       disableUnderline={true}
    //       onChange={this.handleChange}
    //       value={criterion.text}
    //   />
    // </div>

    const {anchorEl} = this.state
    const open = Boolean(anchorEl)

    return (
        <div>
          <IconButton
              aria-label="More"
              aria-owns={open ? 'long-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
          >
            <MoreVertIcon/>
          </IconButton>
          <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200,
                },
              }}
          >
            {options.map(option => (
                <MenuItem key={option} selected={option === 'Pyxis'}
                          onClick={this.handleClose}>
                  {option}
                </MenuItem>
            ))}
          </Menu>
        </div>
    )
  }
}

ListText = withStyles(styles)(ListText)

ListText.propTypes = {
  field: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

ListText.defaultProps = {}

export default ListText