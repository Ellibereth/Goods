import * as types from './types'

const url = "https://www.edgarusa-testserver.herokuapp.com"
const test_url = "http://0.0.0.0:5000"
import {AsyncStorage} from 'react-native'

export function loadUser(jwt){
	return async (dispatch, getState) => {
		let response = await fetch(test_url + "/getUserInfo", {method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
				body:JSON.stringify({
					jwt : jwt,

				})
			})
		let data = await response.json()
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
		let response = await fetch(test_url + "/refreshCheckoutInfo", {method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
				body:JSON.stringify({
					jwt : jwt,
					address : address

				})
			})
			let data = await response.json()
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



export function setUserInfo(responseData) {
	return {
		type: types.SET_USER_INFO,
		user : responseData.user,
		initial_fetch_done : true,
		jwt : responseData.jwt
	}
}