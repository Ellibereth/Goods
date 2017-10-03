import * as types from './types'

import {AsyncStorage} from 'react-native'
import {getUserInfo, refreshCheckoutInfo} from '../api/UserService'

export function loadUser(jwt, address){
	return async (dispatch, getState) => {
		let data = await refreshCheckoutInfo(jwt)
		if (data.success) {
			AsyncStorage.setItem('jwt', data.jwt)
			dispatch(setUserInfo(data))	
		}
		else {
			AsyncStorage.setItem('jwt', "")
			dispatch(setUserInfo({user : "", jwt: ""}))	
		}
	}
}

export function loadUserCheckout(jwt, address){
	return async (dispatch, getState) => {
		let data = await refreshCheckoutInfo(jwt, address)
		if (data.success) {
			AsyncStorage.setItem('jwt', data.jwt)
			dispatch(setUserInfo(data))	
		}
		else {
			AsyncStorage.setItem('jwt', "")
			dispatch(setUserInfo({user : "", jwt: ""}))	
		}
	}
}

export function logoutUser(){
	return (dispatch, getState) => {
		AsyncStorage.setItem('jwt', "")
		dispatch(setUserInfo(""))	
	}
}



export function setUserInfo(data) {
	if (data.jwt){
		AsyncStorage.setItem('jwt', data.jwt).done()	
	}
	return {
		type: types.SET_USER_INFO,
		user : data.user,
		initial_fetch_done : true,
		jwt : data.jwt
	}
}