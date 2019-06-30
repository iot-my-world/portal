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
  Client as ClientEntity,
  ClientRecordHandler,
} from 'brain/party/client'
import PartyHolder from 'brain/party/holder/Holder'
import Query from 'brain/search/Query'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import BEPTable from 'components/table/bepTable/BEPTable'
import {TextCriterionType} from 'brain/search/criterion/types'
import {
  activeStates as clientDetailDialogActiveStates,
} from 'components/party/client/detail/Detail'
import {
  ViewDetailsIcon,
  AddNewIcon,
  ReloadIcon,
  EmailIcon,
} from 'components/icon'
import ClientDetailDialogContainer
  from 'components/party/client/detail/DetailContainer'
import PartyRegistrar from 'brain/party/registrar/Registrar'
import PartyIdentifier from 'brain/search/identifier/Party'
import IdIdentifier from 'brain/search/identifier/Id'
import {ClientPartyType} from 'brain/party/types'

const styles = theme => ({})

const states = {
  nop: 0,
  itemSelected: 1,
}

const events = {
  init: states.nop,
  selectRow: states.itemSelected,
}

class Client extends Component {
  state = {
    activeState: events.init,

    recordCollectionInProgress: false,
    records: [],
    totalNoRecords: 0,

    selectedClient: new ClientEntity(),

    detailDialogOpen: false,
    initialDetailDialogActiveState:
    clientDetailDialogActiveStates.viewingExisting,
  }

  partyHolder = new PartyHolder()
  collectTimeout = () => {
  }
  collectCriteria = []
  collectQuery = new Query()
  clientRegistration = {}

  componentDidMount() {
    this.collect()
  }

  handleCriteriaQueryChange = (criteria, query) => {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.setState({
      activeState: events.init,
      selectedClient: new ClientEntity(),
    })
  }

  handleSelect = (rowObj) => {
    this.setState({
      selectedClient: new ClientEntity(rowObj),
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
      collectResponse = await ClientRecordHandler.Collect({
        criteria: this.collectCriteria,
        query: this.collectQuery,
      })
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error('Error Fetching Clients', e)
      NotificationFailure('Error Fetching Clients', e)
      return
    }

    try {
      // find the admin user registration status of these companies
      this.clientRegistration = (await PartyRegistrar.AreAdminsRegistered({
        partyIdentifiers: collectResponse.records.map(client => {
          return new PartyIdentifier({
            partyIdIdentifier: new IdIdentifier(client.id),
            partyType: ClientPartyType,
          })
        }),
      })).result
    } catch (e) {
      console.error(`error collecting records: ${e}`)
      NotificationFailure('Error Fetching Clients')
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
      return
    }
    this.setState({recordCollectionInProgress: false})
  }

  handleCreateNew = () => {
    const {
      claims,
    } = this.props
    const newClient = new ClientEntity()
    newClient.parentId = claims.partyId
    newClient.parentPartyType = claims.partyType
    this.setState({
      selectedClient: newClient,
      initialDetailDialogActiveState:
      clientDetailDialogActiveStates.editingNew,
      detailDialogOpen: true,
    })
  }

  handleInviteAdmin = async () => {
    const {selectedClient} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()
    try {
      // perform the invite
      await PartyRegistrar.InviteClientAdminUser({
        clientIdentifier: selectedClient.identifier,
      })
      NotificationSuccess('Client Admin User Invited')
    } catch (e) {
      console.error('Failed to Invite Client Admin User', e)
      NotificationFailure('Failed to Invite Client Admin User')
    }
    HideGlobalLoader()
  }

  render() {
    const {
      recordCollectionInProgress,
      records,
      totalNoRecords,
      detailDialogOpen,
      selectedClient,
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
                  width: 170,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Type',
                  accessor: 'type',
                  width: 88,
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
                  Header: 'Admin Registered',
                  accessor: '',
                  filterable: false,
                  sortable: false,
                  Cell:
                    rowCellInfo =>
                      this.clientRegistration[rowCellInfo.original.id]
                        ? 'Yes'
                        : 'No',
                },
              ]}
              handleRowSelect={this.handleSelect}
            />
          </CardContent>
        </Card>
        {detailDialogOpen &&
        <ClientDetailDialogContainer
          open={detailDialogOpen}
          closeDialog={() => this.setState({detailDialogOpen: false})}
          client={selectedClient}
          initialActiveState={initialDetailDialogActiveState}
        />}
      </div>
    )
  }

  getAdditionalTableIcons = () => {
    const {
      activeState, selectedClient,
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
              clientDetailDialogActiveStates.viewingExisting,
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
      if (!this.clientRegistration[selectedClient.id]) {
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

Client = withStyles(styles)(Client)

Client.propTypes = {
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
Client.defaultProps = {}

export default Client