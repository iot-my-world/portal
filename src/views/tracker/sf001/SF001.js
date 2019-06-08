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
  SF001Tracker, SF001TrackerRecordHandler,
} from 'brain/tracker/sf001'
import PartyHolder from 'brain/party/holder/Holder'
import Query from 'brain/search/Query'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import BEPTable from 'components/table/bepTable/BEPTable'
import {TextCriterionType} from 'brain/search/criterion/types'
import {
  FaGlasses as ViewDetailsIcon,
  FaPlus as AddNewIcon,
  FaSyncAlt as ReloadIcon,
} from 'react-icons/fa'

const styles = theme => ({})

const states = {
  nop: 0,
  itemSelected: 1,
}

const events = {
  init: states.nop,
  selectRow: states.itemSelected,
}

class SF001 extends Component {
  state = {
    activeState: events.init,

    recordCollectionInProgress: false,
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,

    selectedSF001Tracker: new SF001Tracker(),
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
      selectedSF001Tracker: new SF001Tracker(),
      selectedRowIdx: -1,
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
      collectResponse = await SF001TrackerRecordHandler.Collect(
        this.collectCriteria,
        this.collectQuery,
      )
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error('Error Fetching SF001 devices', e)
      NotificationFailure('Error Fetching SF001 devices', e)
      return
    }

    try {
      await this.partyHolder.load(
        collectResponse.records,
        'ownerPartyType',
        'ownerId',
      )
      await this.partyHolder.load(
        collectResponse.records,
        'assignedPartyType',
        'assignedId',
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

  render() {
    const {
      recordCollectionInProgress,
      selectedRowIdx,
      records,
      totalNoRecords,
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
                  Header: 'Owner Party Type',
                  accessor: 'ownerPartyType',
                  width: 155,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Owned By',
                  accessor: 'ownerId',
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
                  Header: 'Assigned Party Type',
                  accessor: 'assignedPartyType',
                  width: 170,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Assigned To',
                  accessor: 'assignedId',
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
              getTdProps={(state, rowInfo) => {
                const rowIndex = rowInfo ? rowInfo.index : undefined
                return {
                  onClick: (e, handleOriginal) => {
                    if (rowInfo) {
                      // this.handleSelect(rowInfo.original, rowInfo.index)
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
      </div>
    )
  }

  getAdditionalTableIcons = () => {
    const {activeState} = this.state
    let additionalIcons = [
      (
        <IconButton
          // onClick={this.handleCreateNew}
        >
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
        <IconButton
          onClick={this.collect}
        >
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
          // onClick={() => this.setState({
          //   detailDialogOpen: true,
          //   initialDetailDialogActiveState:
          //   zx303TrackerDetailDialogActiveStates.viewingExisting,
          // })}
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

SF001 = withStyles(styles, {withTheme: true})(SF001)

SF001.propTypes = {
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
SF001.defaultProps = {}

export default SF001