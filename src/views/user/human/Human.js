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
  User as UserEntity,
  UserRecordHandler,
} from 'brain/user/human'
import PartyHolder from 'brain/party/holder/Holder'
import Query from 'brain/search/Query'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import BEPTable from 'components/table/bepTable/BEPTable'
import {TextCriterionType} from 'brain/search/criterion/types'
import {
  activeStates as userDetailDialogActiveStates,
} from 'components/user/human/detail/Detail'
import {
  ViewDetailsIcon,
  AddNewIcon,
  ReloadIcon,
  EmailIcon,
} from 'components/icon'
import UserDetailDialogContainer
  from 'components/user/human/detail/DetailContainer'
import PartyRegistrar from 'brain/party/registrar/Registrar'

const styles = theme => ({})

const states = {
  nop: 0,
  itemSelected: 1,
}

const events = {
  init: states.nop,
  selectRow: states.itemSelected,
}

class Human extends Component {
  state = {
    activeState: events.init,

    recordCollectionInProgress: false,
    records: [],
    totalNoRecords: 0,

    selectedUser: new UserEntity(),

    detailDialogOpen: false,
    initialDetailDialogActiveState:
    userDetailDialogActiveStates.viewingExisting,
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
      selectedUser: new UserEntity(),
    })
  }

  handleSelect = (rowObj) => {
    this.setState({
      selectedUser: new UserEntity(rowObj),
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

    let collectResponse
    try {
      collectResponse = await UserRecordHandler.Collect({
        criteria: this.collectCriteria,
        query: this.collectQuery,
      })
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error('Error Fetching Users', e)
      NotificationFailure('Error Fetching Users', e)
      return
    }

    try {
      await this.partyHolder.load(
        collectResponse.records,
        'parentPartyType',
        'parentId',
      )
      await this.partyHolder.load(
        collectResponse.records,
        'partyType',
        'partyId',
      )
      this.partyHolder.update(
        party,
        claims.partyType,
      )
    } catch (e) {
      console.error('Error Loading Associated Parties', e)
      NotificationFailure('Error Loading Associated Parties')
      return
    }
    this.setState({recordCollectionInProgress: false})
  }

  handleCreateNew = () => {
    const {
      claims,
    } = this.props
    const newUser = new UserEntity()
    newUser.parentId = claims.partyId
    newUser.parentPartyType = claims.partyType
    this.setState({
      selectedUser: newUser,
      initialDetailDialogActiveState:
      userDetailDialogActiveStates.editingNew,
      detailDialogOpen: true,
    })
  }

  handleInviteAdmin = async () => {
    const {selectedUser} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()
    try {
      // perform the invite
      await PartyRegistrar.InviteUser({
        userIdentifier: selectedUser.identifier,
      })
      NotificationSuccess('User Invited')
    } catch (e) {
      console.error('Failed to Invite User', e)
      NotificationFailure('Failed to Invite User')
    }
    HideGlobalLoader()
  }

  render() {
    const {
      recordCollectionInProgress,
      records,
      totalNoRecords,
      detailDialogOpen,
      selectedUser,
      initialDetailDialogActiveState,
    } = this.state
    const {
      classes,
    } = this.props

    return (
      <div className={classes.root}>
        <Card>
          <CardContent>
            <BEPTable
              loading={recordCollectionInProgress}
              totalNoRecords={totalNoRecords}
              noDataText={'No Users Found'}
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
                  Header: 'Surname',
                  accessor: 'surname',
                  width: 155,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Username',
                  accessor: 'username',
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
                {
                  Header: 'Party Type',
                  accessor: 'partyType',
                  width: 155,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Party',
                  accessor: 'partyId',
                  Cell: rowInfo => {
                    return this.partyHolder.retrieveEntityProp(
                      'name',
                      rowInfo.value,
                    )
                  },
                  width: 150,
                  filterable: false,
                },
                {
                  Header: 'Registered',
                  accessor: 'registered',
                  filterable: false,
                  sortable: false,
                  Cell:
                    rowCellInfo =>
                      rowCellInfo.value
                        ? 'Yes'
                        : 'No',
                },
              ]}
              handleRowSelect={this.handleSelect}
            />
          </CardContent>
        </Card>
        {detailDialogOpen &&
        <UserDetailDialogContainer
          open={detailDialogOpen}
          closeDialog={() => this.setState({detailDialogOpen: false})}
          user={selectedUser}
          initialActiveState={initialDetailDialogActiveState}
        />}
      </div>
    )
  }

  getAdditionalTableIcons = () => {
    const {
      activeState, selectedUser,
    } = this.state
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
              userDetailDialogActiveStates.viewingExisting,
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
      if (!selectedUser.registered) {
        additionalIcons = [
          (
            <IconButton
              onClick={this.handleInviteAdmin}
            >
              <Tooltip
                title={'Invite Admin'}
                placement={'top'}
              >
                <Icon>
                  <EmailIcon/>
                </Icon>
              </Tooltip>
            </IconButton>
          ),
          ...additionalIcons,
        ]
      }
    }
    return additionalIcons
  }
}

Human = withStyles(styles)(Human)

Human.propTypes = {
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
Human.defaultProps = {}

export default Human