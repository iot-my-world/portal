import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Input, Menu, MenuItem,
} from '@material-ui/core'
import {
  TextCriterion,
} from 'brain/search/criterion'

const styles = (theme) => ({})

class ListText extends Component {

  constructor(props) {
    super(props)
    this.setFilterHeight = this.setFilterHeight.bind(this)
    this.onSearchTextChange = this.onSearchTextChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleItemSelect = this.handleItemSelect.bind(this)
    this.state = {
      maxFilterHeight: 31,
      criterion: new TextCriterion({
        field: props.field,
        text: '',
      }),
      menuOpen: false,
      searchValue: '',
    }
    this.searchInputRef = React.createRef()
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

  onSearchTextChange(e) {
    const {searchValue, menuOpen} = this.state
    if (!menuOpen) {
      this.setState({menuOpen: true})
    }
    this.setState({searchValue: searchValue + e.key})
  }

  handleItemSelect() {
    this.setState({menuOpen: false})
  }

  setFilterHeight(element) {
    this.setState({maxFilterHeight: element.clientHeight})
  }

  render() {
    const {
      criterion,
      menuOpen,
      maxFilterHeight,
      searchValue,
    } = this.state

    return <div
        ref={this.setFilterHeight}
        style={{
          maxHeight: maxFilterHeight,
          overflow: 'hidden',
        }}
    >
      <Input
          disableUnderline={true}
          onChange={this.onSearchTextChange}
          value={searchValue}
          onKeyPress={this.onSearchTextChange}
      />
      {(this.searchInputRef.current) &&
      <Menu
          id="simple-menu"
          anchorEl={this.searchInputRef.current}
          open={menuOpen}
          onClose={() => this.setState({menuOpen: false})}
          onKeyPress={this.onSearchTextChange}
          keepMounted={true}
      >
        <MenuItem onClick={this.handleItemSelect}>Profile</MenuItem>
        <MenuItem onClick={this.handleItemSelect}>My account</MenuItem>
        <MenuItem onClick={this.handleItemSelect}>Logout</MenuItem>
      </Menu>}
      <div
          ref={this.searchInputRef}
          style={{height: maxFilterHeight * 2}}
      />
    </div>
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