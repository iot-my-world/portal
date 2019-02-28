import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card, CardContent, Chip, Grid,
  TextField, withStyles,
} from '@material-ui/core'

const styles = theme => ({
  root: {padding: 10},
  availableRoot: {},
  availableWindow: {
    backgroundColor: "#f2f2f2",
    boxShadow: 'inset 0 0 4px #000000',
    height: 120,
    padding: 5,
    overflow: 'auto',
  },
  selectedRoot: {},
  selectedWindow: {
    backgroundColor: "#f2f2f2",
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
    this.state = {
      selected: props.selected,
      available: props.available,
    }
  }

  handleAdd(...things) {
    console.log('select', things)
  }

  handleRemove(...things) {
    console.log('delete', things)
  }

  render(){
    const {classes, displayAccessor} = this.props
    const {selected, available} = this.state
    return <div className={classes.selectRoot}>
      <Card>
        <CardContent>
          <Grid container spacing={8}>
            <Grid item>
              <div className={classes.availableRoot}>
                <TextField
                    className={classes.searchField}
                    label='Available'
                    variant='outlined'
                />
                <div className={classes.availableWindow}>
                  {available.map((item, idx) => {
                    return <div key={idx}
                                className={classes.chipWrapper}>
                      <Chip
                          className={classes.chip}
                          label={item[displayAccessor]}
                          color='primary'
                          // avatar={<Avatar><DoneIcon/></Avatar>}
                          clickable
                          onClick={this.handleAdd}
                      />
                    </div>
                  })}
                </div>
              </div>
            </Grid>
            <Grid item>
              <div className={classes.selectedRoot}>
                <TextField
                    className={classes.searchField}
                    label='Selected'
                    variant='outlined'
                />
                <div className={classes.selectedWindow}>
                  {selected.map((item, idx) => {
                    return <div key={idx}
                                className={classes.chipWrapper}>
                      <Chip
                          className={classes.chip}
                          label={item[displayAccessor]}
                          color='primary'
                          clickable
                          onClick={() => console.log('clicked!!!!')}
                          onDelete={this.handleRemove}
                      />
                    </div>
                  })}
                </div>
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
  selected: PropTypes.array.isRequired,
  available: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
}
MultiSelect.defaultProps = {

}

export default MultiSelect