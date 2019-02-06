import {
  setClaims,
} from 'actions/actionTypes'

export function SetClaims(claims){
  return {type: setClaims, data: claims}
}