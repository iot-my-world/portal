import {
  LoginFailed, LoginSucceeded
} from './actionTypes'

export function LoginSuccess(){
  return {type: LoginSucceeded}
}

export function LoginFailure(){
  return {type: LoginFailed}
}