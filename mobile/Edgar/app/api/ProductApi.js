const url = "https://edgarusa-testserver.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

export async function getProductInfo(product_id) {
		
		let resp = await fetch(test_url + "/getMarketProductInfo", {
			method: "POST",
			headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			body: JSON.stringify(
				{
					product_id : product_id ? product_id.toString() : ""
				})
		})
		let data = await resp.json()
		return data
}

export async function getProductsByListing(tag){
	let resp = await fetch(test_url + "/getProductsByListingTag", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
				body:JSON.stringify({
					tag: tag	
				})
			})
		let data = await resp.json()
		return data
}

export async function getOnSaleProducts(){
	let resp = await fetch(test_url + "/getOnSaleProducts", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},	})
	let data = await resp.json()
	return data
}




