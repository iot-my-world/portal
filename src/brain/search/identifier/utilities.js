
/**
 * Check if given object is identified by given
 * identifier
 * @param {object} objectToCheck - object to check
 * @param {object} identifier
 * @returns {boolean}
 */
export function objectIdentifiedBy(objectToCheck, identifier){
  try {
    for(let field in identifier.value){
      if (identifier.value[field] !== objectToCheck[field]){
        return false
      }
    }
  } catch (e) {
    console.error('error trying to check if object is identified by given identifier', e)
    return false
  }

  return true
}

/**
 * Retrieve object from list with given identifier
 * @param {object} identifier
 * @param {object[]} list
 * @returns {*|undefined}
 */
export function retrieveFromList(identifier, list){
  try {
    for (let idx=0; idx<list.length; idx++){
      if (objectIdentifiedBy(list[idx], identifier)){
        return list[idx]
      }
    }
  } catch (e) {
    console.error('error retrieving object from list', e)
  }
}