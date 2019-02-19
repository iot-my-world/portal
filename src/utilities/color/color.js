
/**
 * Convert hexadecimal color to RGBA value with
 * given opacity
 * @param {string} hex
 * @param {number} opacity
 * @returns {string}
 */
export function HexToRGBA(hex, opacity) {
  let val = hex
  if (val.startsWith('#')) {
    val = val.substring(1)
  }
  if (val.length !== 6) {
    console.error('The hex value is invalid:', hex)
    return 'rgba(255, 255, 255, 1)'
  }

  const red = parseInt(val.substr(0, 2), 16)
  const green = parseInt(val.substr(2, 2), 16)
  const blue = parseInt(val.substr(4, 2), 16)
  return 'rgba(' + red + ',' + green + ',' + blue + ',' + opacity + ')'
}