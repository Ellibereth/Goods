import * as types from './types'

const url = "https://www.edgarusa-testserver.herokuapp.com"
const test_url = "http://0.0.0.0:5000"
import {AsyncStorage} from 'react-native'

export function loadUserInfo(jwt){
	return (dispatch, getState) => {
		return fetch(test_url + "/getUserInfo", {method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
				body:JSON.stringify({
					jwt : jwt	
				})
			})
			.then((response) => response.json())
			.then((responseData) => {
				if (responseData.success) {

					AsyncStorage.setItem('jwt', responseData.jwt);
					dispatch(setUserInfo(responseData))	
				}
				else {
					AsyncStorage.setItem('jwt', "")
					dispatch(setUserInfo({}))	
				}
				
			})
			.catch((error) => {
				console.log(error)
			})
			.done();
	}
}



export function setUserInfo(responseData) {
	return {
		type: types.SET_USER_INFO,
		user : responseData.user,
		jwt : responseData.jwt
	}
}