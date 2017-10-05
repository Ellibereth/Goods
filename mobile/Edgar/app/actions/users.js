import * as types from './types'

import {AsyncStorage} from 'react-native'
import {getUserInfo, refreshCheckoutInfo} from '../api/UserService'

export function loadUser(jwt, address){
	return async (dispatch, getState) => {
		let data = await refreshCheckoutInfo(jwt, address)
		if (data.success) {
			dispatch(setUserInfo(data.user))	
			dispatch(setJwt(data.jwt))
		}
		else {
			dispatch(setUserInfo(""))
			dispatch(setJwt(""))	
		}
	}
}

export function logoutUser(){
	return (dispatch, getState) => {
		dispatch(setJwt(""))
		dispatch(setUserInfo(""))	
	}
}


export function setJwt(jwt) {
	AsyncStorage.setItem('jwt', jwt).done()		
	return {
		type : types.SET_JWT,
		jwt : jwt,
	}
}

export function setUserInfo(user) {
	return {
		type: types.SET_USER_INFO,
		user : user,
		initial_fetch_done : true,

	}
	
}