export async function handleLoginSubmit(email, password, loadUser) {
		var url = "https://edgarusa-testserver.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		let resp = await fetch(test_url + "/checkLogin", {method: "POST",
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