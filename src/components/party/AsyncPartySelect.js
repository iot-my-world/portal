import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {
  ClientPartyType,
  CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'
import {SystemRecordHandler} from 'brain/party/system'
import TextCriterion from 'brain/search/criterion/Text'
import IdIdentifier from 'brain/search/identifier/Id'
import {CompanyRecordHandler} from 'brain/party/company'
import {ClientRecordHandler} from 'brain/party/client'
import AsyncSelect from 'components/form/newasyncSelect/AsyncSelect'
import {
  allPartyTypes,
} from 'brain/party/types'
import {PartyHolder} from 'brain/party/holder/index'

const loadPartyOptions = partyType => async (inputValue, callback) => {
  let collectResponse
  let callbackResults = []
  switch (partyType) {
    case SystemPartyType:
      collectResponse = await SystemRecordHandler.Collect({
        criteria: [
          new TextCriterion({
            field: 'name',
            text: inputValue,
          }),
        ],
      })
      callbackResults = collectResponse.records.map(system => ({
        label: system.name,
        value: new IdIdentifier(system.id),
        entity: system,
      }))
      break

    case CompanyPartyType:
      collectResponse = await CompanyRecordHandler.Collect({
          criteria: [
            new TextCriterion({
              field: 'name',
              text: inputValue,
            }),
          ],
        },
      )
      callbackResults = collectResponse.records.map(company => ({
        label: company.name,
        value: new IdIdentifier(company.id),
        entity: company,
      }))
      break

    case ClientPartyType:
      collectResponse = await ClientRecordHandler.Collect({
        criteria: [
          new TextCriterion({
            field: 'name',
            text: inputValue,
          }),
        ],
      })
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

function usePartyHolder(entity, entityPartyTypeAccessor, entityPartyIdAccessor) {
  const [partyHolder, setPartyHolder] = useState(new PartyHolder())

  useEffect(() => {
    const load = async () => {
      const partyHolder = new PartyHolder()
      await partyHolder.load(
        [entity],
        entityPartyTypeAccessor,
        entityPartyIdAccessor,
      )
      setPartyHolder(partyHolder)
    }
    load()
  }, [setPartyHolder, entity, entityPartyTypeAccessor, entityPartyIdAccessor])

  return [partyHolder, setPartyHolder]
}

function AsyncPartySelect(props) {
  const {
    partyType,
    entity,
    entityPartyTypeAccessor,
    entityPartyIdAccessor,
    onChange,
    ...rest
  } = props

  const [partyHolder, setPartyHolder] = usePartyHolder(
    entity,
    entityPartyTypeAccessor,
    entityPartyIdAccessor,
  )

  const handleChange = e => {
    if (e.selectionInfo.value !== '') {
      partyHolder.update(
        e.selectionInfo.entity,
        entity[entityPartyTypeAccessor],
      )
      setPartyHolder(partyHolder)
    }
    onChange(e)
  }

  return (
    <React.Fragment>
      <AsyncSelect
        loadOptions={loadPartyOptions(partyType)}
        value={{
          value: entity[entityPartyIdAccessor],
          label: partyHolder.retrieveEntityProp(
            'name',
            entity[entityPartyIdAccessor],
          ),
        }}
        onChange={handleChange}
        {...rest}
      />
    </React.Fragment>
  )
}

AsyncPartySelect.propTypes = {
  partyType: PropTypes.oneOf([
    ...allPartyTypes,
    '',
  ]).isRequired,
  entity: PropTypes.object.isRequired,
  entityPartyTypeAccessor: PropTypes.string,
  entityPartyIdAccessor: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

AsyncPartySelect.defaultProps = {
  entityPartyTypeAccessor: 'partyType',
  entityPartyIdAccessor: 'partyId',
}

export default AsyncPartySelect