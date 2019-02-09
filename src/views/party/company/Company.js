import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Grid, Card, CardContent, CardActions, Typography,
    Button,
} from '@material-ui/core'
import {
  Table,
} from 'components/table'

const styles = theme => ({})

const states = {
  nop: 0,
  viewingExisting: 1,
  editingNew: 2,
  editingExisting: 3,
}

const events = {
  selectExisting: states.viewingExisting,
  startCreateNew: states.editingNew,
}

class Company extends Component {
  render() {
    return <Grid container direction='row'>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant={'body1'}>
              Select Company to View or Update
            </Typography>
            <Table
                data={[{a:1, b:2}]}
                columns={[
                  {
                    Header: 'A',
                    accessor: 'a',
                  },
                ]}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  }
}

Company = withStyles(styles)(Company)

Company.propTypes = {

}

Company.defaultProps = {
  
}

export default Company