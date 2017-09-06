import * as types from './types'

const url = "https://www.edgarusa.com"
const test_url = "http://0.0.0.0:5000"

export function getHomeProducts(){
	return (dispatch, getState) => {
		return fetch(test_url + "/getProductsByListingTag", {method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
				body:JSON.stringify({
					tag: "Home_Page"	
				})
			})
			.then((response) => response.json())
			.then((responseData) => {
				dispatch(setHomeProducts({products : responseData.products }))
			})
			.catch((error) => {
				console.log(error)
			})
			.done();
	}
}

export function setHomeProducts({products}) {
	return {
		type: types.SET_HOME_PRODUCTS,
		products  
	}
}