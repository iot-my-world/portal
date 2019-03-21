import {PartyIdentifierType} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import BaseIdentifier from './Base'

export default class Party extends BaseIdentifier {
  static identifierType = PartyIdentifierType

  /**
   * @type {string}
   * @private
   */
  _type = Party.identifierType

  /**
   * @type {{party: string}}
   * @private
   */
  _value = {
    party: '',
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
        this._value.party = party.party
      } else if (isString(party)) {
        this._value.party = party
      } else {
        throw new TypeError(
            'invalid arg passed to Party identifier constructor')
      }
    }
  }

  get party() {
    return this._value.party
  }
}