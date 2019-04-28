import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  withStyles,
} from '@material-ui/core'
import {TextCriterionType} from 'brain/search/criterion/types'
import BEPTable from 'components/table/bepTable/BEPTable'
import {ZX303 as ZX303Device} from 'brain/tracker/device/zx303/index'
import Query from 'brain/search/Query'
import ZX303DeviceRecordHandler from 'brain/tracker/device/zx303/RecordHandler'
import PartyHolder from 'brain/party/holder/Holder'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gridTemplateColumns: '1fr',
    gridRowGap: '8px',
  },
  cardHeaderRoot: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  deviceTableRoot: {},
  tableCard: {
    overflow: 'auto',
  },
})

class Tasks extends Component {
  state = {
    recordCollectionInProgress: false,
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,
    selectedZX303Device: new ZX303Device(),
  }

  collectCriteria = []
  collectQuery = new Query()
  collectTimeout = () => {
  }
  partyHolder = new PartyHolder()

  componentDidMount() {
    this.collect()
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
      collectResponse = await ZX303DeviceRecordHandler.Collect(
          this.collectCriteria,
          this.collectQuery,
      )
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error('Error Fetching ZX303 devices', e)
      NotificationFailure('Error Fetching ZX303 devices', e)
      this.setState({recordCollectionInProgress: false})
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
      this.setState({recordCollectionInProgress: false})
      return
    }
    this.setState({recordCollectionInProgress: false})
  }

  handleCriteriaQueryChange = (criteria, query) => {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.setState({
      selectedRowIdx: -1,
      selectedZX303Device: new ZX303Device(),
    })
  }

  render() {
    const {
      classes,
      theme,
    } = this.props
    const {
      recordCollectionInProgress,
      selectedRowIdx,
      records,
      totalNoRecords,
    } = this.state

    return (
        <div
            className={classes.root}
        >
          <div className={classes.deviceTableRoot}>
            <Card
                id={'zx303ConfigurationDetailCard'}
                className={classes.tableCard}
            >
              <CardHeader
                  title={'Select Device To Manage Tasks'}
                  classes={{root: classes.cardHeaderRoot}}
              />
              <CardContent>
                <BEPTable
                    loading={recordCollectionInProgress}
                    totalNoRecords={totalNoRecords}
                    noDataText={'No Devices Found'}
                    data={records}
                    onCriteriaQueryChange={this.handleCriteriaQueryChange}
                    columns={[
                      {
                        Header: 'IMEI',
                        accessor: 'imei',
                        width: 150,
                        config: {
                          filter: {
                            type: TextCriterionType,
                          },
                        },
                      },
                      {
                        Header: 'Owner Party Type',
                        accessor: 'ownerPartyType',
                        width: 136,
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
                        width: 160,
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
                      {
                        Header: 'Sim Country Code',
                        accessor: 'simCountryCode',
                        width: 150,
                        config: {
                          filter: {
                            type: TextCriterionType,
                          },
                        },
                      },
                      {
                        Header: 'Sim Number',
                        accessor: 'simNumber',
                        width: 150,
                        config: {
                          filter: {
                            type: TextCriterionType,
                          },
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
          </div>
        </div>
    )
  }
}

Tasks = withStyles(styles, {withTheme: true})(Tasks)

Tasks.propTypes = {
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
Tasks.defaultProps = {}

export default Tasks