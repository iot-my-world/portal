export function isString(value) {
  return typeof value === 'string'
}

export function isArray(value) {
  return value && typeof value === 'object' && value.constructor === Array
}

export function isObject(value) {
  return value && typeof value === 'object' && {}.toString.apply(value) ===
      '[object Object]'
}

export function isNumber(value) {
  return typeof value === 'number' && isFinite(value)
}

export function isFunction(value) {
  return typeof value === 'function'
}

export function isBoolean(value) {
  return typeof (value) === typeof (true)
}

export function stringToBytes(str) {
  let bytes = []
  for(let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i)
    bytes.push(char)
  }
  return bytes
}