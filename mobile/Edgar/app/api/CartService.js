import {executeRequest} from './EdgarApiCaller'

const CHECKOUT_CART_ROUTE = '/checkoutCart'
const ADD_TO_CART_ROUTE = '/addItemToCart'
const UPDATE_CART_QUANTITY_ROUTE = '/updateCartQuantity'

export async function handleCheckoutCart(jwt, address_id, card_id) {
		var form_data =  {
				jwt : jwt,
				address_id: address_id,
				card_id : card_id
			}
		let data = await executeRequest(CHECKOUT_CART_ROUTE, form_data)
		return data
}

export async function addItemToCart(jwt, product_id, quantity, variant){
	var form_data = {
					"quantity" : quantity,
					"product_id" : product_id, 
					"jwt" : jwt,
					"variant" : variant
				}

	let data = await executeRequest(ADD_TO_CART_ROUTE, form_data)
	return data
}

//  update cart quantity
export async function updateCartQuantity(jwt, cart_item, quantity){
	var form_data = {
					"jwt" : jwt,
					cart_item : cart_item,
					new_num_items : quantity
				}
	let data = await executeRequest(UPDATE_CART_QUANTITY_ROUTE, form_data)
	return data
}
