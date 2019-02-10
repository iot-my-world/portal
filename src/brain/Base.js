import {isFunction} from 'utilities/type'

/**
 * The base class for all entities
 */
export default class Base {

  static ignoreInPost = []

  toPOJO() {
    let retObj = {}
    // for each field on this object
    Object.keys(this).forEach(field => {
      // if the field starts with and _ (e.g. on a trade we have : _status, _date etc)
      if (field.startsWith('_')) {
        // get the field name without the _
        const fieldName = field.slice(1)
        // if the field is NOT included in the ignoreInPost array (i.e. the field is NOT to be ignored)
        if (!Base.ignoreInPost.includes(fieldName)) {
          if (
              // if the data at the field is not undefined or null
              !(
                  (this[field] === undefined) ||
                  (this[field] === null)
              ) &&
              // and the data at the field has a forPost method
              (isFunction(this[field].toPOJO))
          ) {
            // then set the field equal to it's forPost output
            retObj[fieldName] = this[field].toPOJO()
          } else {
            // otherwise, parse the data at the field if the field is listed in
            retObj[fieldName] = this[field]
          }
        }
      }
    })
    return retObj
  }
}
