import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card, CardContent, Chip, Grid,
  TextField, withStyles, Button,
} from '@material-ui/core'

const styles = theme => ({
  root: {padding: 10},
  availableRoot: {
    display: 'grid',
  },
  availableWindow: {
    backgroundColor: '#f2f2f2',
    boxShadow: 'inset 0 0 4px #000000',
    height: 120,
    padding: 5,
    overflow: 'auto',
  },
  selectedRoot: {
    display: 'grid',
  },
  selectedWindow: {
    backgroundColor: '#f2f2f2',
    boxShadow: 'inset 0 0 4px #000000',
    height: 120,
    padding: 5,
    overflow: 'auto',
  },
  chip: {},
  chipWrapper: {
    padding: 2,
  },
  searchField: {
    width: '100%',
  },
})

class MultiSelect extends Component {
  constructor(props) {
    super(props)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.renderAvailableChips = this.renderAvailableChips.bind(this)
    this.renderSelectedChips = this.renderSelectedChips.bind(this)
    this.handleSelectAll = this.handleSelectAll.bind(this)
    this.handleRemoveAll = this.handleRemoveAll.bind(this)
    this.state = {
      selected: [...props.selected],
      available: [...props.available],
      selectedFilter: '',
      availableFilter: '',
    }
  }

  handleAdd(item) {
    let {
      available,
      selected,
    } = this.state
    const {
      uniqueIdAccessor,
      onChange,
    } = this.props

    // remove item from the available list
    available = available.filter(availableItem =>
        availableItem[uniqueIdAccessor] !== item[uniqueIdAccessor])

    // add item to the selected list
    selected.push(item)

    // update state
    this.setState({
      selected,
      available,
    })
    onChange(selected, available)
  }

  handleRemove(item) {
    let {
      available,
      selected,
    } = this.state
    const {
      uniqueIdAccessor,
      onChange,
    } = this.props

    // remove item from the selected list
    selected = selected.filter(selectedItem =>
        selectedItem[uniqueIdAccessor] !== item[uniqueIdAccessor])

    // add item to the available list
    available.push(item)

    // update state
    this.setState({
      selected,
      available,
    })
    onChange(selected, available)
  }

  handleSelectAll() {
    let {
      available,
      selected,
    } = this.state
    const {
      onChange,
    } = this.props

    selected = [
      ...available,
      ...selected,
    ]
    available = []

    this.setState({
      available,
      selected,
    })
    onChange(selected, available)
  }

  handleRemoveAll() {
    let {
      available,
      selected,
    } = this.state
    const {
      onChange,
    } = this.props
    available = [
      ...available,
      ...selected,
    ]
    selected = []
    this.setState({
      available,
      selected,
    })
    onChange(selected, available)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      selected: prevSelected,
      available: prevAvailable,
    } = prevProps
    const {
      selected,
      available,
    } = this.props
    if (
        (prevSelected.length !== selected.length) ||
        (available.length !== prevAvailable.length)
    ) {
      this.setState({
        selected: [...selected],
        available: [...available],
      })
    }
  }

  handleFilterChange(e) {
    this.setState({[e.target.id]: e.target.value})
  }

  renderAvailableChips() {
    const {available, availableFilter} = this.state
    const {classes, displayAccessor} = this.props

    let chips = []
    available.forEach((item, idx) => {
      if (item[displayAccessor].includes(availableFilter)) {
        chips.push(<div key={idx}
                        className={classes.chipWrapper}>
          <Chip
              className={classes.chip}
              label={item[displayAccessor]}
              color='primary'
              // avatar={<Avatar><DoneIcon/></Avatar>}
              clickable
              onClick={() => this.handleAdd(item)}
          />
        </div>)
      }
    })
    return chips
  }

  renderSelectedChips() {
    const {selected, selectedFilter} = this.state
    const {classes, displayAccessor} = this.props

    let chips = []
    selected.forEach((item, idx) => {
      if (item[displayAccessor].includes(selectedFilter)) {
        chips.push(<div key={idx}
                        className={classes.chipWrapper}>
          <Chip
              className={classes.chip}
              label={item[displayAccessor]}
              color='primary'
              onDelete={() => this.handleRemove(item)}
          />
        </div>)
      }
    })
    return chips
  }

  onChange() {
    const {onChange} = this.props
    const {
      available,
      selected,
    } = this.state
    onChange(selected, available)
  }

  render() {
    const {classes} = this.props
    const {availableFilter, selectedFilter} = this.state
    return <div className={classes.selectRoot}>
      <Card>
        <CardContent>
          <Grid container spacing={8}>
            <Grid item sm={6} xs={12}>
              <div className={classes.availableRoot}>
                <TextField
                    id='availableFilter'
                    className={classes.searchField}
                    label='Available'
                    variant='outlined'
                    value={availableFilter}
                    onChange={this.handleFilterChange}
                />
                <div className={classes.availableWindow}>
                  {this.renderAvailableChips()}
                </div>
                <Button
                    color='primary'
                    variant='contained'
                    size='small'
                    onClick={this.handleSelectAll}
                >
                  Select All
                </Button>
              </div>
            </Grid>
            <Grid item sm={6} xs={12}>
              <div className={classes.selectedRoot}>
                <TextField
                    id='selectedFilter'
                    className={classes.searchField}
                    label='Selected'
                    variant='outlined'
                    value={selectedFilter}
                    onChange={this.handleFilterChange}
                />
                <div className={classes.selectedWindow}>
                  {this.renderSelectedChips()}
                </div>
                <Button
                    color='primary'
                    variant='contained'
                    size='small'
                    onClick={this.handleRemoveAll}
                >
                  Remove All
                </Button>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  }
}

MultiSelect = withStyles(styles)(MultiSelect)

MultiSelect.propTypes = {
  displayAccessor: PropTypes.string.isRequired,
  uniqueIdAccessor: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  available: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
}
MultiSelect.defaultProps = {}

export default MultiSelect