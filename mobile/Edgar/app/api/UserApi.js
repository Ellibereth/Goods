export async function handleLoginSubmit(email, password) {
		var url = "https://edgarusa-testserver.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		let resp = await fetch(test_url + "/checkLogin", {
			method: "POST",
			headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			body: JSON.stringify(
				{
					email : email,
					password: password
				})
		})
		let data = await resp.json()
		return data
}


export async function handleRegisterSubmit(name, email, password, password_confirm) {
		var url = "https://edgarusa-testserver.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		let resp = await fetch(test_url + "/registerUserAccount", {
			method: "POST",
			headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			body: JSON.stringify({	
					name : name,
					email : email,
					password: password,
					password_confirm : password_confirm
				})
		})
		let data = await resp.json()
		return data
}

export async function handleAddAddress(form_data) {
	var url = "https://edgarusa-testserver.herokuapp.com"
	var test_url = "http://0.0.0.0:5000"
	let resp = await fetch(test_url + "/addUserAddress", {
		method: "POST",
		headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		body: JSON.stringify(form_data)
	})
	let data = await resp.json()
	return data
}

export async function handleAddBilling(form_data) {
	var url = "https://edgarusa-testserver.herokuapp.com"
	var test_url = "http://0.0.0.0:5000"
	let resp = await fetch(test_url + "/addCreditCard", {
		method: "POST",
		headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		body: JSON.stringify(form_data)
	})
	let data = await resp.json()
	return data
}

export async function getUserOrders(jwt) {
	var url = "https://edgarusa-testserver.herokuapp.com"
	var test_url = "http://0.0.0.0:5000"
	let resp = await fetch(test_url + "/getUserOrders", {
		method: "POST",
		headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		body: JSON.stringify({
			jwt : jwt
		})
	})
	let data = await resp.json()
	return data
}


