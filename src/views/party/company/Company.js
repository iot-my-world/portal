import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent, Icon,
  IconButton,
  Tooltip,
  withStyles,
} from '@material-ui/core'
import {
  Company as CompanyEntity,
  CompanyRecordHandler,
} from 'brain/party/company'
import PartyHolder from 'brain/party/holder/Holder'
import Query from 'brain/search/Query'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import BEPTable from 'components/table/bepTable/BEPTable'
import {TextCriterionType} from 'brain/search/criterion/types'
import {
  activeStates as companyDetailDialogActiveStates,
} from 'components/party/company/detail/Detail'
import {
  ViewDetailsIcon,
  AddNewIcon,
  ReloadIcon,
} from 'components/icon'
import CompanyDetailDialogContainer
  from 'components/party/company/detail/DetailContainer'

const styles = theme => ({})

const states = {
  nop: 0,
  itemSelected: 1,
}

const events = {
  init: states.nop,
  selectRow: states.itemSelected,
}

class Company extends Component {
  state = {
    activeState: events.init,

    recordCollectionInProgress: false,
    records: [],
    totalNoRecords: 0,

    selectedCompany: new CompanyEntity(),

    detailDialogOpen: false,
    initialDetailDialogActiveState:
    companyDetailDialogActiveStates.viewingExisting,
  }

  partyHolder = new PartyHolder()
  collectTimeout = () => {
  }
  collectCriteria = []
  collectQuery = new Query()

  componentDidMount() {
    this.collect()
  }

  handleCriteriaQueryChange = (criteria, query) => {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.setState({
      activeState: events.init,
      selectedCompany: new CompanyEntity(),
    })
  }

  handleSelect = (rowObj) => {
    this.setState({
      selectedCompany: new CompanyEntity(rowObj),
      activeState: events.selectRow,
    })
  }

  collect = async () => {
    const {
      NotificationFailure,
      party,
      claims,
    } = this.props
    this.setState({recordCollectionInProgress: true})
    // perform device collection
    let collectResponse
    try {
      collectResponse = await CompanyRecordHandler.Collect({
        criteria: this.collectCriteria,
        query: this.collectQuery,
      })
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error('Error Fetching Companies', e)
      NotificationFailure('Error Fetching Companies', e)
      return
    }

    try {
      await this.partyHolder.load(
        collectResponse.records,
        'parentPartyType',
        'parentId',
      )
      this.partyHolder.update(
        party,
        claims.partyType,
      )
    } catch (e) {
      console.error('Error Loading Associated Parties', e)
      NotificationFailure('Error Loading Associated Parties')
    }
    this.setState({recordCollectionInProgress: false})
  }

  handleCreateNew = () => {
    this.setState({
      selectedCompany: new CompanyEntity(),
      // initialDetailDialogActiveState:
      // companyDetailDialogActiveStates.editingNew,
      detailDialogOpen: true,
    })
  }

  render() {
    const {
      recordCollectionInProgress,
      records,
      totalNoRecords,
      detailDialogOpen,
      selectedCompany,
      initialDetailDialogActiveState,
    } = this.state
    const {
      theme,
      classes,
    } = this.props

    return (
      <div className={classes.root}>
        <Card>
          <CardContent>
            <BEPTable
              loading={recordCollectionInProgress}
              totalNoRecords={totalNoRecords}
              noDataText={'No Devices Found'}
              data={records}
              onCriteriaQueryChange={this.handleCriteriaQueryChange}
              additionalControls={this.getAdditionalTableIcons()}
              columns={[
                {
                  Header: 'Name',
                  accessor: 'name',
                  width: 155,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Admin Email Address',
                  accessor: 'adminEmailAddress',
                  width: 155,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Parent Party Type',
                  accessor: 'parentPartyType',
                  width: 155,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Parent',
                  accessor: 'parentId',
                  Cell: rowInfo => {
                    return this.partyHolder.retrieveEntityProp(
                      'name',
                      rowInfo.value,
                    )
                  },
                  width: 150,
                  filterable: false,
                },
              ]}
              handleRowSelect={this.handleSelect}
            />
          </CardContent>
        </Card>
        {detailDialogOpen &&
        <CompanyDetailDialogContainer
          open={detailDialogOpen}
          closeDialog={() => this.setState({detailDialogOpen: false})}
          company={selectedCompany}
          initialActiveState={initialDetailDialogActiveState}
        />}
      </div>
    )
  }

  getAdditionalTableIcons = () => {
    const {activeState} = this.state
    let additionalIcons = [
      (
        <IconButton onClick={this.handleCreateNew}>
          <Tooltip
            title={'Add New'}
            placement={'top'}
          >
            <Icon>
              <AddNewIcon/>
            </Icon>
          </Tooltip>
        </IconButton>
      ),
      (
        <IconButton onClick={this.collect}>
          <Tooltip
            title={'Reload'}
            placement={'top'}
          >
            <Icon>
              <ReloadIcon/>
            </Icon>
          </Tooltip>
        </IconButton>
      ),
    ]

    if (activeState === states.itemSelected) {
      additionalIcons = [
        (
          <IconButton
            onClick={() => this.setState({
              detailDialogOpen: true,
              initialDetailDialogActiveState:
              companyDetailDialogActiveStates.viewingExisting,
            })}
          >
            <Tooltip
              title={'View Details'}
              placement={'top'}
            >
              <Icon>
                <ViewDetailsIcon/>
              </Icon>
            </Tooltip>
          </IconButton>
        ),
        ...additionalIcons,
      ]
    }
    return additionalIcons
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
  /**
   * Party from redux state
   */
  party: PropTypes.object.isRequired,
}
Company.defaultProps = {}

export default Company