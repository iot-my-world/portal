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

const states = {
  nop: 0,
  itemSelected: 1,
}

const actionTypes = {
  init: 0,
  selectRow: 1,
}

function initialState() {
  return {
    activeState: states.nop,
    selectedBackend: new Backend(),
    detailDialogOpen: false,
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

    case actionTypes.init:
    default:
      return initialState()
  }
}

function BackendManagement(props) {
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
    <IconButton>
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
            ]}
            handleRowSelect={selectedBackend => actionDispatcher({
              type: actionTypes.selectRow,
              selectedBackend,
            })}
          />
        </CardContent>
      </Card>
    </div>
  )
}

BackendManagement.propTypes = {}

BackendManagement.defaultProps = {}

export default BackendManagement