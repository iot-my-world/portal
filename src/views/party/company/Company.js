import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Grid, Card, CardContent, CardActions, Typography,
  Button, TextField,
} from '@material-ui/core'
import {
  BEPTable,
} from 'components/table'
import {
  Company as CompanyEntity,
  RecordHandler as CompanyRecordHandler,
} from 'brain/party/company'
import {FullPageLoader} from 'components/loader'
import {ReasonsInvalid} from 'brain/validate'
import {Text} from 'brain/search/criterion/types'
import {Query} from 'brain/search'

const styles = theme => ({
  formField: {
    height: '60px',
    width: '150px',
  },
  progress: {
    margin: 2,
  },
})

const states = {
  nop: 0,
  viewingExisting: 1,
  editingNew: 2,
  editingExisting: 3,
}

const events = {
  selectExisting: states.viewingExisting,

  startCreateNew: states.editingNew,
  cancelCreateNew: states.nop,
  createNewSuccess: states.viewingExisting,

  startEditExisting: states.editingExisting,
}

class Company extends Component {

  state = {
    recordCollectionInProgress: false,
    isLoading: false,
    activeState: states.nop,
    selected: new CompanyEntity(),
  }

  reasonsInvalid = new ReasonsInvalid()

  collectCriteria = []
  collectQuery = new Query()
  records = []
  totalNoRecords = 0

  constructor(props) {
    super(props)
    this.renderControls = this.renderControls.bind(this)
    this.renderCompanyDetails = this.renderCompanyDetails.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSaveNew = this.handleSaveNew.bind(this)
    this.handleCriteriaQueryChange = this.handleCriteriaQueryChange.bind(this)
    this.collect = this.collect.bind(this)
    this.collectTimeout = () => {
    }
  }

  componentDidMount() {
    this.collect()
  }

  handleChange(event) {
    let {
      selected,
    } = this.state
    selected[event.target.id] = event.target.value
    this.reasonsInvalid.clearField(event.target.id)
    this.setState({selected})
  }

  handleSaveNew() {
    const {
      selected,
    } = this.state
    const {
      NotificationSuccess,
      NotificationFailure,
    } = this.props
    try {

      this.setState({isLoading: true})
      selected.validate('Create').then(reasonsInvalid => {
        if (reasonsInvalid.count > 0) {
          this.reasonsInvalid = reasonsInvalid
          this.setState({isLoading: false})
        } else {
          selected.create().then(newCompany => {
            NotificationSuccess('Successfully Created Company')
            this.setState({
              selected: newCompany,
              activeState: events.createNewSuccess,
            })
          }).catch(error => {
            console.error('Error Creating Company', error)
            NotificationFailure('Error Creating Company')
          }).finally(() => {
            this.setState({isLoading: false})
          })
        }
      }).catch(error => {
        console.error('Error Validating Company', error)
        NotificationFailure('Error Validating Company')
        this.setState({isLoading: false})
      })
    } catch (error) {
      console.error('Error Creating Company', error)
    }
  }

  collect() {
    const {
      NotificationFailure,
    } = this.props

    this.setState({recordCollectionInProgress: true})
    CompanyRecordHandler.Collect(this.collectCriteria, this.collectQuery)
        .then(response => {
          this.records = response.records
          this.totalNoRecords = response.total
        })
        .catch(error => {
          console.error(`error collecting records: ${error}`)
          NotificationFailure('Failed To Fetch Companies')
        })
        .finally(() => {
          this.setState({recordCollectionInProgress: false})
        })
  }

  handleCriteriaQueryChange(criteria, query) {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
  }

  render() {
    const {
      isLoading,
      recordCollectionInProgress,
    } = this.state

    return <Grid
        container
        direction='column'
        spacing={8}
    >
      <Grid item xl={12}>
        <Card>
          <CardContent>
            {this.renderCompanyDetails()}
          </CardContent>
          {this.renderControls()}
        </Card>
      </Grid>
      <Grid item xl={12}>
        <Card>
          <CardContent>
            <BEPTable
                loading={recordCollectionInProgress}
                totalNoRecords={this.totalNoRecords}
                noDataText={'No Companies Found'}
                data={this.records}
                onCriteriaQueryChange={this.handleCriteriaQueryChange}

                columns={[
                  {
                    Header: 'Name',
                    accessor: 'name',
                    config: {
                      filter: {
                        type: Text,
                      },
                    },
                  },
                  {
                    Header: 'Admin Email',
                    accessor: 'adminEmailAddress',
                    config: {
                      filter: {
                        type: Text,
                      },
                    },
                  },
                ]}
            />
          </CardContent>
        </Card>
      </Grid>
      <FullPageLoader open={isLoading}/>
    </Grid>
  }

  renderCompanyDetails() {
    const {
      isLoading,
      activeState,
    } = this.state
    const {
      classes,
    } = this.props

    const fieldValidations = this.reasonsInvalid.toMap()
    const disableFields = (activeState === states.viewingExisting) ||
        isLoading

    switch (activeState) {

      case states.nop:
        return <Typography variant={'body1'}>
          Select Company or <Button
            size='small'
            color='primary'
            variant='contained'
            onClick={() => this.setState({
              activeState: events.startCreateNew,
              selected: new CompanyEntity(),
            })}
        >
          Create New
        </Button>
        </Typography>

      case states.viewingExisting:
      case states.editingNew:
        const {
          selected,
        } = this.state
        return <React.Fragment>
          <Typography variant={'body1'}>
            {(() => {

            })()}
            New Company Creation
          </Typography>
          <Grid
              container
              direction='column'
              spacing={8}
          >
            <Grid item>
              <TextField
                  className={classes.formField}
                  id='name'
                  label='Name'
                  value={selected.name}
                  onChange={this.handleChange}
                  disabled={disableFields}
                  helperText={
                    fieldValidations.name
                        ? fieldValidations.name.help
                        : undefined
                  }
                  error={!!fieldValidations.name}
              />
            </Grid>
            <Grid item>
              <TextField
                  className={classes.formField}
                  id='adminEmailAddress'
                  label='Admin Email'
                  value={selected.adminEmailAddress}
                  onChange={this.handleChange}
                  disabled={disableFields}
                  helperText={
                    fieldValidations.adminEmailAddress
                        ? fieldValidations.adminEmailAddress.help
                        : undefined
                  }
                  error={!!fieldValidations.adminEmailAddress}
              />
            </Grid>
          </Grid>
        </React.Fragment>

      default:
    }

  }

  renderControls() {
    const {
      activeState,
    } = this.state

    switch (activeState) {
      case states.viewingExisting:
        return <CardActions>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={() => this.setState({
                activeState: events.startEditExisting,
              })}
          >
            Edit
          </Button>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={() => this.setState({
                activeState: events.startCreateNew,
                selected: new CompanyEntity(),
              })}
          >
            Create New
          </Button>
        </CardActions>

      case states.editingNew:
        return <CardActions>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={this.handleSaveNew}
          >
            Save New
          </Button>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={() => this.setState(
                  {activeState: events.cancelCreateNew})}
          >
            Cancel
          </Button>
        </CardActions>

      case states.nop:
      default:
    }
  }
}

Company = withStyles(styles)(Company)

Company.propTypes = {
  /**
   * Success Action Creator
   */
  NotificationSuccess: PropTypes.func.isRequired,
  /**
   * Failure Action Creator
   */
  NotificationFailure: PropTypes.func.isRequired,
}

Company.defaultProps = {}

export default Company