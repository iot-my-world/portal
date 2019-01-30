import {
  LoginFailed, LoginSucceeded
} from 'actions/actionTypes'

export function LoginSuccess(){
  return {type: LoginSucceeded}
}

export function LoginFailure(){
  return {type: LoginFailed}
}