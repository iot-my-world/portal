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
  render(){
    const {classes} = this.props
    return<div className={classes.selectRoot}>
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
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(thing => {
                    return <div key={thing}
                                className={classes.chipWrapper}>
                      <Chip
                          className={classes.chip}
                          label='monteagle'
                          color='primary'
                          // avatar={<Avatar><DoneIcon/></Avatar>}
                          clickable
                          onClick={() => console.log('clicked!!!!')}
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
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(thing => {
                    return <div key={thing}
                                className={classes.chipWrapper}>
                      <Chip
                          className={classes.chip}
                          label='monteagle logistics'
                          color='primary'
                          clickable
                          onClick={() => console.log('clicked!!!!')}
                          onDelete={()=> console.log('delete!!!')}
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

MultiSelect.propTypes = {}
MultiSelect.defaultProps = {}

export default MultiSelect