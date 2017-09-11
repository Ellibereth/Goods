const url = "https://edgarusa-testserver.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

export async function handleCheckoutCart(jwt, address_id, card_id) {
		let resp = await fetch(test_url + "/checkoutCart", {
			method: "POST",
			headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			body: JSON.stringify({
					jwt : jwt,
					card_id : card_id,
					address_id : address_id
				})
		})
		let data = await resp.json()
		return data
}

export async function addItemToCart(jwt, product_id, quantity, variant){
	let resp = await fetch(test_url + "/addItemToCart", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},	
				body : JSON.stringify({
					"quantity" : quantity,
					"product_id" : product_id, 
					"jwt" : jwt,
					"variant" : variant
				})
			})
	let data = await resp.json()
	return data
}

//  update cart quantity
export async function updateCartQuantity(jwt, cart_item, quantity){
	console.log(quantity)
	let resp = await fetch(test_url + "/updateCartQuantity", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},	
				body : JSON.stringify({
					"jwt" : jwt,
					cart_item : cart_item,
					new_num_items : quantity
				})
			})
	let data = await resp.json()
	return data
}
