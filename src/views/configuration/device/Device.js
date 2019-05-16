import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Grid, Card, CardContent,
} from '@material-ui/core'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import {ZX303 as ZX303Device} from 'brain/tracker/zx303/index'
import PartyHolder from 'brain/party/holder/Holder'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import Query from 'brain/search/Query'
import ZX303DeviceRecordHandler from 'brain/tracker/zx303/RecordHandler'
import ZX303DeviceValidator from 'brain/tracker/zx303/Validator'
import ZX303DeviceAdministrator from 'brain/tracker/zx303/Administrator'
import {
  ClientPartyType,
  CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'
import SystemRecordHandler from 'brain/party/system/RecordHandler'
import TextCriterion from 'brain/search/criterion/Text'
import IdIdentifier from 'brain/search/identifier/Id'
import CompanyRecordHandler from 'brain/party/company/RecordHandler'
import ClientRecordHandler from 'brain/party/client/RecordHandler'
import {TextCriterionType} from 'brain/search/criterion/types'
import BEPTable from 'components/table/bepTable/BEPTable'

const styles = theme => ({
  root: {
    width: 'calc(100% - 16px)',
    margin: 0,
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

class ZX303 extends Component {
  state = {
    recordCollectionInProgress: false,
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,
    activeState: events.init,
    zx303DeviceEntity: new ZX303Device(),
    zx303DeviceEntityCopy: new ZX303Device(),
  }

  partyHolder = new PartyHolder()
  collectTimeout = () => {
  }
  reasonsInvalid = new ReasonsInvalid()
  collectCriteria = []
  collectQuery = new Query()

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
    // perform device collection
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

  handleCreateNew = () => {
    this.reasonsInvalid.clearAll()
    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      zx303DeviceEntity: new ZX303Device(),
    })
  }

  handleCancelCreateNew = () => {
    this.reasonsInvalid.clearAll()
    this.setState({activeState: events.cancelCreateNew})
  }

  handleStartEditExisting = () => {
    this.reasonsInvalid.clearAll()
    const {zx303DeviceEntity} = this.state
    this.setState({
      zx303DeviceEntityCopy: new ZX303Device(zx303DeviceEntity),
      activeState: events.startEditExisting,
    })
  }

  handleCancelEditExisting = () => {
    const {zx303DeviceEntityCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      zx303DeviceEntity: new ZX303Device(zx303DeviceEntityCopy),
      activeState: events.cancelEditExisting,
    })
  }

  handleSaveNew = async () => {
    const {zx303DeviceEntity} = this.state
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      this.reasonsInvalid.clearAll()
      const reasonsInvalid = (await ZX303DeviceValidator.Validate({
        zx303: zx303DeviceEntity,
        action: 'Create',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating Device', e)
      NotificationFailure('Error Validating Device')
      HideGlobalLoader()
      return
    }

    // perform creation
    try {
      await ZX303DeviceAdministrator.Create({
        zx303: zx303DeviceEntity,
      })
      NotificationSuccess('Successfully Created Device')
      this.setState({activeState: events.createNewSuccess})
      await this.collect()
    } catch (e) {
      console.error('Error Creating Device', e)
      NotificationFailure('Error Creating Device')
      HideGlobalLoader()
      return
    }
    HideGlobalLoader()
  }

  handleSaveChanges = async () => {
    const {zx303DeviceEntity} = this.state
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      this.reasonsInvalid.clearAll()
      const reasonsInvalid = (await ZX303DeviceValidator.Validate({
        zx303: zx303DeviceEntity,
        action: 'Update',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating Device', e)
      NotificationFailure('Error Validating Device')
      HideGlobalLoader()
      return
    }

    // perform update
    try {
      let {records} = this.state
      let response = await ZX303DeviceAdministrator.UpdateAllowedFields({
        zx303: zx303DeviceEntity,
      })
      const zx303DeviceIdx = records.find(d => d.id === response.zx303.id)
      if (zx303DeviceIdx < 0) {
        console.error('unable to fund updated device in records')
      } else {
        records[zx303DeviceIdx] = response.zx303
      }
      this.setState({
        records,
        zx303DeviceEntity: response.zx303,
        activeState: events.finishEditExisting,
      })
    } catch (e) {
      console.error('Error Updating Device', e)
      NotificationFailure('Error Updating Device')
      HideGlobalLoader()
      return
    }

    NotificationSuccess('Successfully Updated Device')
    HideGlobalLoader()
  }

  loadPartyOptions = partyType => async (inputValue, callback) => {
    let collectResponse
    let callbackResults = []
    switch (partyType) {
      case SystemPartyType:
        collectResponse = await SystemRecordHandler.Collect(
          [
            new TextCriterion({
              field: 'name',
              text: inputValue,
            }),
          ],
        )
        callbackResults = collectResponse.records.map(system => ({
          label: system.name,
          value: new IdIdentifier(system.id),
          entity: system,
        }))
        break

      case CompanyPartyType:
        collectResponse = await CompanyRecordHandler.Collect(
          [
            new TextCriterion({
              field: 'name',
              text: inputValue,
            }),
          ],
        )
        callbackResults = collectResponse.records.map(company => ({
          label: company.name,
          value: new IdIdentifier(company.id),
          entity: company,
        }))
        break

      case ClientPartyType:
        collectResponse = await ClientRecordHandler.Collect(
          [
            new TextCriterion({
              field: 'name',
              text: inputValue,
            }),
          ],
        )
        callbackResults = collectResponse.records.map(client => ({
          label: client.name,
          value: new IdIdentifier(client.id),
          entity: client,
        }))
        break

      default:
        callbackResults = []
    }
    callbackResults = [{label: '-', value: ''}, ...callbackResults]
    callback(callbackResults)
  }

  handleFieldChange = e => {
    let {zx303DeviceEntity} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id
    zx303DeviceEntity[fieldName] = e.target.value

    switch (fieldName) {
      case 'ownerPartyType':
        zx303DeviceEntity.ownerId = new IdIdentifier()
        break

      case 'ownerId':
        this.partyHolder.update(
          e.selectionInfo.entity,
          zx303DeviceEntity.ownerPartyType,
        )
        break

      case 'assignedPartyType':
        zx303DeviceEntity.assignedId = new IdIdentifier()
        break

      case 'assignedId':
        this.partyHolder.update(
          e.selectionInfo.entity,
          zx303DeviceEntity.assignedPartyType,
        )
        break

      default:
    }

    this.reasonsInvalid.clearField(fieldName)
    this.setState({zx303DeviceEntity})
  }

  handleCriteriaQueryChange = (criteria, query) => {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.reasonsInvalid.clearAll()
    this.setState({
      activeState: events.init,
      zx303DeviceEntity: new ZX303Device(),
      selectedRowIdx: -1,
    })
  }

  handleSelect = (rowObj, rowIdx) => {
    this.reasonsInvalid.clearAll()
    this.setState({
      selectedRowIdx: rowIdx,
      zx303DeviceEntity: new ZX303Device(rowObj),
      activeState: events.selectExisting,
    })
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

    return (
        <Grid
            container
            direction='column'
            spacing={8}
            alignItems='center'
            className={classes.root}
        >
          <Grid item>
            <Card>
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
          </Grid>
        </Grid>
    )
  }
}

ZX303 = withStyles(styles, {withTheme: true})(ZX303)

ZX303.propTypes = {
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
ZX303.defaultProps = {}

export default ZX303