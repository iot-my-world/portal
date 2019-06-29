import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField, CardHeader, Fab, Tooltip,
} from '@material-ui/core'
import DomainIcon from '@material-ui/icons/Domain'
import {BEPTable} from 'components/table/index'
import {
  Company as CompanyEntity,
  CompanyRecordHandler,
  CompanyValidator,
  CompanyAdministrator,
} from 'brain/party/company'
import {ReasonsInvalid} from 'brain/validate/index'
import {TextCriterionType} from 'brain/search/criterion/types'
import {Query} from 'brain/search/index'
import PartyRegistrar from 'brain/party/registrar/Registrar'
import {HumanUserLoginClaims} from 'brain/security/claims'
import {CompanyPartyType} from 'brain/party/types'
import IdIdentifier from 'brain/search/identifier/Id'
import PartyIdentifier from 'brain/search/identifier/Party'
import {
  MdAdd as AddIcon, MdClear as CancelIcon,
  MdEdit as EditIcon,
  MdEmail as SendEmailIcon, MdSave as SaveIcon,
} from 'react-icons/md'

const styles = theme => ({
  root: {
    width: 'calc(100% - 16px)',
    margin: 0,
  },
  formField: {
    height: '60px',
    width: '150px',
  },
  progress: {
    margin: 2,
  },
  detailCard: {},
  detailCardTitle: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: '1fr',
    alignItems: 'center',
  },
  companyIcon: {
    fontSize: 100,
    color: theme.palette.primary.main,
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonIcon: {
    fontSize: '20px',
  },
})

const states = {
  nop: 0,
  viewingExisting: 1,
  editingNew: 2,
  editingExisting: 3,
}

const events = {
  init: states.nop,

  selectExisting: states.viewingExisting,

  startCreateNew: states.editingNew,
  cancelCreateNew: states.nop,
  createNewSuccess: states.nop,

  startEditExisting: states.editingExisting,
  finishEditExisting: states.viewingExisting,
  cancelEditExisting: states.viewingExisting,
}

class Company extends Component {
  state = {
    recordCollectionInProgress: false,
    activeState: events.init,
    company: new CompanyEntity(),
    companyCopy: new CompanyEntity(),
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,
  }

  reasonsInvalid = new ReasonsInvalid()
  companyRegistration = {}

  collectCriteria = []
  collectQuery = new Query()

  constructor(props) {
    super(props)
    this.renderControlIcons = this.renderControlIcons.bind(this)
    this.renderCompanyDetails = this.renderCompanyDetails.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSaveNew = this.handleSaveNew.bind(this)
    this.handleCriteriaQueryChange = this.handleCriteriaQueryChange.bind(this)
    this.collect = this.collect.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleInviteAdmin = this.handleInviteAdmin.bind(this)
    this.handleCreateNew = this.handleCreateNew.bind(this)
    this.handleCancelCreateNew = this.handleCancelCreateNew.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
    this.handleStartEditExisting = this.handleStartEditExisting.bind(this)
    this.handleCancelEditExisting = this.handleCancelEditExisting.bind(this)
    this.collectTimeout = () => {
    }
  }

  componentDidMount() {
    this.collect()
  }

  handleCreateNew() {
    const {claims} = this.props
    let newCompanyEntity = new CompanyEntity()
    newCompanyEntity.parentId = claims.partyId
    newCompanyEntity.parentPartyType = claims.partyType

    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      company: newCompanyEntity,
    })
  }

  handleFieldChange(event) {
    let {company} = this.state
    company[event.target.id] = event.target.value
    this.reasonsInvalid.clearField(event.target.id)
    this.setState({company})
  }

  async handleSaveNew() {
    const {company} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      const reasonsInvalid = (await CompanyValidator.Validate({
        company,
        action: 'Create',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating Company', e)
      NotificationFailure('Error Validating Company')
      HideGlobalLoader()
      return
    }

    // if validation passes, perform create
    try {
      await CompanyAdministrator.Create({company})
      NotificationSuccess('Successfully Created Company')
      this.setState({activeState: events.createNewSuccess})
      await this.collect()
      HideGlobalLoader()
    } catch (e) {
      console.error('Error Creating Company', e)
      NotificationFailure('Error Creating Company')
      HideGlobalLoader()
    }
  }

  handleCancelCreateNew() {
    this.reasonsInvalid.clearAll()
    this.setState({activeState: events.cancelCreateNew})
  }

  async handleSaveChanges() {
    const {company} = this.state
    let {records} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      const reasonsInvalid = (await CompanyValidator.Validate({
        company,
        action: 'UpdateAllowedFields',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating Company', e)
      NotificationFailure('Error Validating Company')
      HideGlobalLoader()
      return
    }

    // if validation passes, perform update
    try {
      let response = await CompanyAdministrator.UpdateAllowedFields({company})
      const companyIdx = records.findIndex(c => c.id === response.company.id)
      if (companyIdx < 0) {
        console.error('unable to find updated company in records')
      } else {
        records[companyIdx] = response.company
      }
      NotificationSuccess('Successfully Updated Company')
      this.setState({
        records,
        company: response.company,
        activeState: events.finishEditExisting,
      })
      HideGlobalLoader()
    } catch (e) {
      console.error('Error Updating Company', e)
      NotificationFailure('Error Updating Company')
      HideGlobalLoader()
    }
  }

  handleStartEditExisting() {
    const {company} = this.state
    this.setState({
      companyCopy: new CompanyEntity(company),
      activeState: events.startEditExisting,
    })
  }

  handleCancelEditExisting() {
    const {companyCopy} = this.state
    this.setState({
      company: new CompanyEntity(companyCopy),
      activeState: events.cancelEditExisting,
    })
  }

  async collect() {
    const {NotificationFailure} = this.props

    this.setState({recordCollectionInProgress: true})
    try {
      const collectResponse = await CompanyRecordHandler.Collect(
          this.collectCriteria,
          this.collectQuery,
      )
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })

      // find the admin user registration status of these companies
      this.companyRegistration = (await PartyRegistrar.AreAdminsRegistered({
        partyIdentifiers: collectResponse.records.map(company => {
          return new PartyIdentifier({
            partyIdIdentifier: new IdIdentifier(company.id),
            partyType: CompanyPartyType,
          })
        }),
      })).result
    } catch (e) {
      console.error(`error collecting records: ${e}`)
      NotificationFailure('Failed To Fetch Companies')
    }
    this.setState({recordCollectionInProgress: false})
  }

  handleCriteriaQueryChange(criteria, query) {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.setState({
      activeState: events.init,
      company: new CompanyEntity(),
      selectedRowIdx: -1,
    })
  }

  handleSelect(rowRecordObj, rowIdx) {
    this.reasonsInvalid.clearAll()
    this.setState({
      selectedRowIdx: rowIdx,
      company: new CompanyEntity(rowRecordObj),
      activeState: events.selectExisting,
    })
  }

  async handleInviteAdmin() {
    const {company} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()
    try {
      // perform the invite
      await PartyRegistrar.InviteCompanyAdminUser({
        companyIdentifier: company.identifier,
      })
      NotificationSuccess('Company Admin User Invited')
    } catch (e) {
      console.error('Failed to Invite Company Admin User', e)
      NotificationFailure('Failed to Invite Company Admin User')
    }
    HideGlobalLoader()
  }

  render() {
    const {
      recordCollectionInProgress,
      selectedRowIdx,
      records,
      totalNoRecords,
      activeState,
    } = this.state
    const {
      theme,
      classes,
    } = this.props

    let cardTitle = (
        <Typography variant={'h6'}>
          Select A Company To View Or Edit
        </Typography>
    )
    switch (activeState) {
      case states.editingNew:
        cardTitle = (
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                New Company
              </Typography>
              <Grid container
                    direction='row'
                    justify='flex-end'
              >
                <Grid item>
                  {this.renderControlIcons()}
                </Grid>
              </Grid>
            </div>
        )
        break
      case states.editingExisting:
        cardTitle = (
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                Editing
              </Typography>
              <Grid container
                    direction='row'
                    justify='flex-end'
              >
                <Grid item>
                  {this.renderControlIcons()}
                </Grid>
              </Grid>
            </div>
        )
        break
      case states.viewingExisting:
        cardTitle = (
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                Details
              </Typography>
              <Grid container
                    direction='row'
                    justify='flex-end'
              >
                <Grid item>
                  {this.renderControlIcons()}
                </Grid>
              </Grid>
            </div>
        )
        break
      default:
    }

    return (
        <Grid
            id={'companyConfigurationRoot'}
            className={classes.root}
            container direction='column'
            spacing={8}
            alignItems='center'
        >
          <Grid item xl={12}>
            <Grid container>
              <Grid item>
                <Card
                    id={'companyConfigurationDetailCard'}
                    className={classes.detailCard}
                >
                  <CardHeader title={cardTitle}/>
                  <CardContent>
                    {this.renderCompanyDetails()}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xl={12}>
            <Card>
              <CardContent>
                <BEPTable
                    loading={recordCollectionInProgress}
                    totalNoRecords={totalNoRecords}
                    noDataText={'No Companies Found'}
                    data={records}
                    onCriteriaQueryChange={this.handleCriteriaQueryChange}
                    columns={[
                      {
                        Header: 'Name',
                        accessor: 'name',
                        config: {
                          filter: {
                            type: TextCriterionType,
                          },
                        },
                      },
                      {
                        Header: 'Admin Email',
                        accessor: 'adminEmailAddress',
                        config: {
                          filter: {
                            type: TextCriterionType,
                          },
                        },
                      },
                      {
                        Header: 'Admin Registered',
                        accessor: '',
                        filterable: false,
                        sortable: false,
                        Cell: rowCellInfo => {
                          if (this.companyRegistration[rowCellInfo.original.id]) {
                            return 'Yes'
                          } else {
                            return 'No'
                          }
                        },
                      },
                    ]}
                    getTdProps={(state, rowInfo) => {
                      const rowIndex = rowInfo ? rowInfo.index : undefined
                      return {
                        onClick: (e, handleOriginal) => {
                          if (rowInfo) {
                            this.handleSelect(rowInfo.original, rowInfo.index)
                          }
                          if (handleOriginal) {
                            handleOriginal()
                          }
                        },
                        style: {
                          background:
                              rowIndex === selectedRowIdx
                                  ? theme.palette.secondary.light
                                  : 'white',
                          color:
                              rowIndex === selectedRowIdx
                                  ? theme.palette.secondary.contrastText
                                  : theme.palette.primary.main,
                        },
                      }
                    }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    )
  }

  renderCompanyDetails() {
    const {activeState} = this.state
    const {classes} = this.props

    const fieldValidations = this.reasonsInvalid.toMap()
    const stateIsViewing = activeState === states.viewingExisting

    switch (activeState) {
      case states.nop:
        return (
            <Grid
                container
                direction={'column'}
                spacing={1}
                alignItems={'center'}
            >
              <Grid item>
                <DomainIcon className={classes.companyIcon}/>
              </Grid>
              <Grid item>
                <Fab
                    id={'companyConfigurationNewCompanyButton'}
                    color={'primary'}
                    className={classes.button}
                    size={'small'}
                    onClick={this.handleCreateNew}
                >
                  <Tooltip title='Add New Company'>
                    <AddIcon className={classes.buttonIcon}/>
                  </Tooltip>
                </Fab>
              </Grid>
            </Grid>
        )

      case states.viewingExisting:
      case states.editingNew:
      case states.editingExisting:
        const {company} = this.state
        return (
            <Grid container direction='column' spacing={1}
                  alignItems={'center'}>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id='name'
                    label='Name'
                    value={company.name}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
                    helperText={
                      fieldValidations.name ?
                          fieldValidations.name.help :
                          undefined
                    }
                    error={!!fieldValidations.name}
                />
              </Grid>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id='adminEmailAddress'
                    label='Admin Email'
                    value={company.adminEmailAddress}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
                    helperText={
                      fieldValidations.adminEmailAddress
                          ? fieldValidations.adminEmailAddress.help
                          : undefined
                    }
                    error={!!fieldValidations.adminEmailAddress}
                />
              </Grid>
            </Grid>
        )

      default:
    }
  }

  renderControlIcons() {
    const {company, activeState} = this.state
    const {classes} = this.props

    switch (activeState) {
      case states.viewingExisting:
        return (
            <React.Fragment>
              <Fab
                  color={'primary'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleStartEditExisting}
              >
                <Tooltip title='Edit'>
                  <EditIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
              {!this.companyRegistration[company.id] &&
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleInviteAdmin}
              >
                <Tooltip title='Invite Admin'>
                  <SendEmailIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>}
              <Fab
                  id={'companyConfigurationNewCompanyButton'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleCreateNew}
              >
                <Tooltip title='Add New Company'>
                  <AddIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )

      case states.editingNew:
        return (
            <React.Fragment>
              <Fab
                  color={'primary'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleSaveNew}
              >
                <Tooltip title='Save New Company'>
                  <SaveIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleCancelCreateNew}
              >
                <Tooltip title='Cancel'>
                  <CancelIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )

      case states.editingExisting:
        return (
            <React.Fragment>
              <Fab
                  color={'primary'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleSaveChanges}
              >
                <Tooltip title='Save Changes'>
                  <SaveIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleCancelEditExisting}
              >
                <Tooltip title='Cancel'>
                  <CancelIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )

      case states.nop:
      default:
    }
  }
}

Company = withStyles(styles, {withTheme: true})(Company)

Company.propTypes = {
  /**
   * Success Action Creator
   */
  NotificationSuccess: PropTypes.func.isRequired,
  /**
   * Failure Action Creator
   */
  NotificationFailure: PropTypes.func.isRequired,
  /**
   * Show Global App Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global App Loader Action Creator
   */
  HideGlobalLoader: PropTypes.func.isRequired,
  /**
   * Login claims from redux state
   */
  claims: PropTypes.instanceOf(HumanUserLoginClaims),
}

Company.defaultProps = {}

export default Company
