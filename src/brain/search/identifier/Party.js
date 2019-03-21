import {PartyIdentifierType} from 'brain/search/identifier/types'
import {isObject} from 'utilities/type'
import IdIdentifier from './Id'
import BaseIdentifier from './Base'

export default class Party extends BaseIdentifier {
  static identifierType = PartyIdentifierType

  /**
   * @type {string}
   * @private
   */
  _type = Party.identifierType

  /**
   * @type {{
   * partyType: string,
   * partyIdIdentifier: IdIdentifier
   * }}
   * @private
   */
  _value = {
    partyType: '',
    partyIdIdentifier: new IdIdentifier(),
  }

  /**
   * construct a new party identifier
   * @param {string|Party|Object} [party]
   */
  constructor(party) {
    super()
    if (party !== undefined) {
      if (
          (party instanceof Party) ||
          (isObject(party))
      ) {
        this._value.partyType = party.partyType
        this._value.partyIdIdentifier =
            new IdIdentifier(party.partyIdIdentifier)
      } else {
        throw new TypeError(
            'invalid arg passed to Party identifier constructor')
      }
    }
  }

  get partyType() {
    return this._value.partyType
  }

  get partyIdIdentifier() {
    return this._value.partyIdIdentifier
  }
}