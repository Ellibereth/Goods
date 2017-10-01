import {executeRequest} from './EdgarApiCaller'

const GET_PRODUCT_INFO_ROUTE = '/getMarketProductInfo'
const GET_PRODUCTS_BY_LISTING_ROUTE = '/getProductsByListingTag'
const GET_ON_SALE_PRODUCTS = '/getOnSaleProducts'

export async function getProductInfo(product_id) {
		var form_data = {
					product_id : product_id ? product_id.toString() : ""
				}
		let data = await executeRequest(GET_PRODUCT_INFO_ROUTE, form_data)
		return data
}

export async function getProductsByListing(tag, get_related_products){
	var form_data = {
				tag: tag,
				get_related_products : get_related_products
			}
	let data = await executeRequest(GET_PRODUCTS_BY_LISTING_ROUTE, form_data)
	return data
}

export async function getOnSaleProducts(){
	var form_data = {}
	let data = await executeRequest(GET_ON_SALE_PRODUCTS, form_data)
	return data
}




