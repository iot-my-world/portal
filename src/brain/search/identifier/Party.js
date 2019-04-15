import {PartyIdentifierType} from 'brain/search/identifier/types'
import {isObject} from 'utilities/type'
import IdIdentifier from './Id'
import BaseIdentifier from './Base'

export default class Party extends BaseIdentifier {
  static Type = PartyIdentifierType

  /**
   * @type {string}
   * @private
   */
  _partyType = ''

  /**
   * @type {Id}
   * @private
   */
  _partyIdIdentifier = new IdIdentifier()

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
        this._partyType = party.partyType
        this._partyIdIdentifier = new IdIdentifier(party.partyIdIdentifier)
      } else {
        throw new TypeError(
            'invalid arg passed to Party identifier constructor',
        )
      }
    }
  }

  get partyType() {
    return this._partyType
  }

  get partyIdIdentifier() {
    return this._partyIdIdentifier
  }
}