import React, {useEffect, useReducer} from 'react'
import {
  Card, CardContent, Icon, IconButton,
  Tooltip,
} from '@material-ui/core'
import {
  Backend, useBackendRecordHandlerCollect,
} from 'brain/sigfox/backend'
import Query from 'brain/search/Query'
import BEPTable from 'components/table/bepTable/BEPTable'
import {TextCriterionType} from 'brain/search/criterion/types'
import {AddNewIcon, ReloadIcon, ViewDetailsIcon} from 'components/icon/index'
import HoverCopy from 'components/HoverCopy'
import BackendDetailDialog, {
  states as backendDetailDialogStates,
} from 'components/sigfox/backend/DetailDialog'

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
    selectedBackend: new Backend(),
    detailDialogOpen: false,
    detailDialogState: backendDetailDialogStates.creating,
    clearRowSelectionToggle: false,
  }
}

function stateReducer(state, action) {
  switch (action.type) {
    case actionTypes.selectRow:
      return {
        activeState: states.itemSelected,
        selectedBackend: new Backend(action.selectedBackend),
        detailDialogOpen: false,
      }

    case actionTypes.viewDetail:
      return {
        ...state,
        detailDialogState: backendDetailDialogStates.viewingExisting,
        detailDialogOpen: true,
      }

    case actionTypes.startCreateNew:
      return {
        ...state,
        clearRowSelectionToggle: !state.clearRowSelectionToggle,
        detailDialogState: backendDetailDialogStates.creating,
        selectedBackend: new Backend(),
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

function BackendManagement() {
  const [
    {
      collectResponse,
      loading,
      error,
    },
    setCollectRequest,
  ] = useBackendRecordHandlerCollect()
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
      onClick={() => setCollectRequest({
        criteria: [],
        query: new Query(),
      })}
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
            noDataText={'No Backends Found'}
            data={collectResponse.records}
            onCriteriaQueryChange={(criteria, query) => setCollectRequest({
              criteria,
              query,
            })}
            additionalControls={additionalTableControls}
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
                Header: 'Token',
                accessor: 'token',
                width: 155,
                Cell: rowCellInfo => {
                  if (rowCellInfo) {
                    return <HoverCopy value={rowCellInfo.value}/>
                  }
                },
                config: {
                  filter: {
                    type: TextCriterionType,
                  },
                },
              },
            ]}
            handleRowSelect={selectedBackend => actionDispatcher({
              type: actionTypes.selectRow,
              selectedBackend,
            })}
          />
        </CardContent>
      </Card>
      {state.detailDialogOpen &&
      <BackendDetailDialog
        open={state.detailDialogOpen}
        closeDialog={() => actionDispatcher({
          type: actionTypes.closeDetailDialog,
        })}
        backend={state.selectedBackend}
        initialState={state.detailDialogState}
      />}
    </div>
  )
}

BackendManagement.propTypes = {}

BackendManagement.defaultProps = {}

export default BackendManagement