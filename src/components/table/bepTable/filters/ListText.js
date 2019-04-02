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
    this.onSearchBoxKeyPress = this.onSearchBoxKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleItemSelect = this.handleItemSelect.bind(this)
    this.state = {
      maxFilterHeight: 31,
      criterion: new TextCriterion({
        field: props.field,
        text: '',
      }),
      searchMenuOpen: false,
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

  onSearchBoxKeyPress(e) {
    const {searchValue, searchMenuOpen} = this.state
    try {
      e.stopPropagation() 
    } catch (e) {
      console.error('error stopping key press propagation', e)
    }
    // open the search menu
    if (!searchMenuOpen) {
      this.setState({searchMenuOpen: true})
    }

    console.log(e.key, e.code, !e.key)

    try {
       if (e.key.length > 1) {
         switch (e.key) {
           case 'Backspace':
             if (searchValue.length > 0) {
               this.setState({searchValue: searchValue.slice(0, searchValue.length - 1)})
             }
         }
       } else {
         this.setState({searchValue: searchValue + e.key})
       }
    } catch (e) {
      console.error('error processing key press', e)
    }
  }

  handleItemSelect() {
    this.setState({searchMenuOpen: false})
  }

  setFilterHeight(element) {
    this.setState({maxFilterHeight: element.clientHeight})
  }

  render() {
    const {
      criterion,
      searchMenuOpen,
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
          onChange={this.onSearchBoxKeyPress}
          value={searchValue}
          onKeyDown={this.onSearchBoxKeyPress}
      />
      {(this.searchInputRef.current) &&
      <Menu
          id="simple-menu"
          anchorEl={this.searchInputRef.current}
          open={searchMenuOpen}
          onClose={() => this.setState({searchMenuOpen: false})}
          onKeyDown={this.onSearchBoxKeyPress}
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