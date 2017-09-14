const url = "https://edgarusa-testserver.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

// returns the json response from the http request
export async function executeRequest(route, form_data) {
		let resp = await fetch(test_url + route, {
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