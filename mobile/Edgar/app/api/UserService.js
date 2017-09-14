import {executeRequest} from './EdgarApiCaller'

const CHECK_LOGIN_ROUTE = '/checkLogin'
const REGISTER_USER_ROUTE = '/registerUserAccount'
const GET_USER_INFO_ROUTE = '/getUserInfo'
const REFRESH_CHECKOUT_INFO_ROUTE = '/refreshCheckoutInfo'
const GET_USER_ORDERS_ROUTE = '/getUserOrders'
const ADD_USER_ADDRESS_ROUTE = '/addUserAddress'
const ADD_USER_CREDIT_CARD_ROUTE = '/addCreditCard'

export async function handleLoginSubmit(email, password) {
		var form_data =  {
				email : email,
				password: password
			}
		let data = await executeRequest(CHECK_LOGIN_ROUTE, form_data)
		return data
}

export async function handleRegisterSubmit(name, email, password, password_confirm) {
		var form_data = {	
					name : name,
					email : email,
					password: password,
					password_confirm : password_confirm
				}
		let data = await executeRequest(handleRegisterSubmit, form_data)
		return data
}

export async function handleAddAddress(form_data) {
	let data = await executeRequest(ADD_USER_ADDRESS_ROUTE, form_data)
	return data
}

export async function handleAddBilling(form_data) {
	let data = await executeRequest(ADD_USER_CREDIT_CARD_ROUTE, form_data)
	return data
}

export async function getUserOrders(jwt) {
	var form_data = {jwt : jwt}
	let data = await executeRequest(GET_USER_ORDERS_ROUTE, form_data)
	return data
}


export async function getUserInfo(jwt) {
	var form_data = {jwt : jwt}
	let data = await executeRequest(GET_USER_INFO_ROUTE, form_data)
	return data
}

export async function refreshCheckoutInfo(jwt, address) {
	var form_data = {jwt : jwt, address: address}
	let data = await executeRequest(REFRESH_CHECKOUT_INFO_ROUTE, form_data)
	return data
}





