import {executeRequest} from './EdgarApiCaller'

const GET_PRODUCT_INFO_ROUTE = '/getMarketProductInfo'
const GET_PRODUCTS_BY_LISTING_ROUTE = '/getProductsByListingTag'
const GET_ON_SALE_PRODUCTS_ROUTE = '/getOnSaleProducts'
const GET_RELATED_PRODUCTS_ROUTE = '/getRelatedProducts'
const SEARCH_PRODUCTS_ROUTE = '/searchProducts'

export async function getProductInfo(product_id) {
		var form_data = {
					product_id : product_id ? product_id.toString() : ""
				}
		let data = await executeRequest(GET_PRODUCT_INFO_ROUTE, form_data)
		return data
}

export async function getProductsByListing(tag, get_full_details){
	var form_data = {
				tag: tag,
				get_full_details : get_full_details
			}
	let data = await executeRequest(GET_PRODUCTS_BY_LISTING_ROUTE, form_data)
	return data
}

export async function getOnSaleProducts(){
	var form_data = {}
	let data = await executeRequest(GET_ON_SALE_PRODUCTS_ROUTE, form_data)
	return data
}

export async function getRelatedProducts(product_id) {
	var form_data = {product_id : product_id}
	let data = await executeRequest(GET_RELATED_PRODUCTS_ROUTE, form_data)
	return data
}

export async function searchProducts(search_text) {
	var form_data = {search_input : search_text}
	let data = await executeRequest(SEARCH_PRODUCTS_ROUTE, form_data)
	return data
}

