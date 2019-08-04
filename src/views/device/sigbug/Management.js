import React, {useEffect, useReducer} from 'react'
import {
  Card, CardContent, Icon, IconButton,
  Tooltip,
} from '@material-ui/core'
import {
  Sigbug, useSigbugRecordHandlerCollect,
} from 'brain/device/sigbug'
import Query from 'brain/search/Query'
import BEPTable from 'components/table/bepTable/BEPTable'
import {TextCriterionType} from 'brain/search/criterion/types'
import {AddNewIcon, ReloadIcon, ViewDetailsIcon} from 'components/icon/index'
import {
  SigbugDetailDialog,
  sigbugDetailDialogStates,
} from 'components/device/sigbug'
import moment from 'moment'

const states = {
  nop: 0,
  itemSelected: 1,
}

const actionTypes = {
  init: 0,
  selectRow: 1,
  viewDetail: 2,
  startCreateNew: 3,
  closeDetailDialog: 4,
}

function initialState() {
  return {
    activeState: states.nop,
    selectedSigbug: new Sigbug(),
    detailDialogOpen: false,
    detailDialogState: sigbugDetailDialogStates.creating,
    clearRowSelectionToggle: false,
  }
}

function stateReducer(state, action) {
  switch (action.type) {
    case actionTypes.selectRow:
      return {
        activeState: states.itemSelected,
        selectedSigbug: new Sigbug(action.selectedSigbug),
        detailDialogOpen: false,
      }

    case actionTypes.viewDetail:
      return {
        ...state,
        detailDialogState: sigbugDetailDialogStates.viewingExisting,
        detailDialogOpen: true,
      }

    case actionTypes.startCreateNew:
      return {
        ...state,
        clearRowSelectionToggle: !state.clearRowSelectionToggle,
        detailDialogState: sigbugDetailDialogStates.creating,
        selectedSigbug: new Sigbug(),
        detailDialogOpen: true,
      }

    case actionTypes.closeDetailDialog:
      return {
        detailDialogOpen: false,
      }

    case actionTypes.init:
    default:
      return initialState()
  }
}

function SigbugManagement() {
  const [
    {
      collectResponse,
      loading,
      error,
    },
    setCollectRequest,
  ] = useSigbugRecordHandlerCollect()
  const [state, actionDispatcher] = useReducer(
    stateReducer,
    initialState(),
  )

  useEffect(() => setCollectRequest({
    criteria: [],
    query: new Query(),
  }), [setCollectRequest])

  let additionalTableControls = [
    <IconButton
      onClick={() => actionDispatcher({
        type: actionTypes.startCreateNew,
      })}
    >
      <Tooltip
        title={'Add New'}
        placement={'top'}
      >
        <Icon>
          <AddNewIcon/>
        </Icon>
      </Tooltip>
    </IconButton>,
    <IconButton
      onClick={() => {
        setCollectRequest({
          criteria: [],
          query: new Query(),
        })
        actionDispatcher({
          type: actionTypes.init,
        })
      }}
    >
      <Tooltip
        title={'Reload'}
        placement={'top'}
      >
        <Icon>
          <ReloadIcon/>
        </Icon>
      </Tooltip>
    </IconButton>,
  ]

  if (state.activeState === states.itemSelected) {
    additionalTableControls = [
      <IconButton
        onClick={() => actionDispatcher({
          type: actionTypes.viewDetail,
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
      </IconButton>,
      ...additionalTableControls,
    ]
  }

  return (
    <div>
      <Card>
        <CardContent>
          <BEPTable
            error={error}
            loading={loading}
            clearRowSelectionToggle={state.clearRowSelectionToggle}
            totalNoRecords={collectResponse.total}
            noDataText={'No Sigbugs Found'}
            data={collectResponse.records}
            onCriteriaQueryChange={(criteria, query) => setCollectRequest({
              criteria,
              query,
            })}
            additionalControls={additionalTableControls}
            columns={[
              {
                Header: 'Device ID',
                accessor: 'deviceId',
                width: 155,
                config: {
                  filter: {
                    type: TextCriterionType,
                  },
                },
              },
              {
                Header: 'Last Message @',
                accessor: 'lastMessage.timeStamp',
                Cell: rowCellData => {
                  try {
                    if (rowCellData.value > 0) {
                      return moment.unix(rowCellData.value).format('HH:mm:ss - YYYY-MM-DD')
                    }
                  } catch (e) {
                    console.error('error rendering last message timestamp', e)
                  }
                  return '-'
                },
                width: 155,
                filterable: false,
              },
            ]}
            handleRowSelect={selectedSigbug => actionDispatcher({
              type: actionTypes.selectRow,
              selectedSigbug,
            })}
          />
        </CardContent>
      </Card>
      {state.detailDialogOpen &&
      <SigbugDetailDialog
        open={state.detailDialogOpen}
        closeDialog={() => actionDispatcher({
          type: actionTypes.closeDetailDialog,
        })}
        sigbug={state.selectedSigbug}
        initialState={state.detailDialogState}
        onCreateSuccess={() => setCollectRequest({
          criteria: [],
          query: new Query(),
        })}
      />}
    </div>
  )
}

SigbugManagement.propTypes = {}

SigbugManagement.defaultProps = {}

export default SigbugManagement