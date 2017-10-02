var dateFormat = require('dateformat')

export function getParameterByName(name, url) {
	if (!url) url = window.location.href
	name = name.replace(/[\[\]]/g, '\\$&')
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url)
	if (!results) return null
	if (!results[2]) return ''
	return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// takes price as float, outputs it into USD currency
// price is taken in an integer for number of cents
export function formatPrice(price){
	if (price == null || price == undefined) {
		return ''
	}
	if (isNaN(price)) {
		return ''
	}
	var dollars = price / 100
	return dollars.toFixed(2)
}

export function formatDate(date){
	var local_date = new Date(date)
	var formatted_date = dateFormat(local_date, 'dddd, mmmm dS, yyyy, h:MM:ss TT')
	return formatted_date
}

export function toTitleCase(str)
{
	if (!str){
		return ''
	}
	else {
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})	
	}
	
}

export function getCurrentPrice(product){
	if (!product)  {
		return ''
	}
	else {
		return product.price
	}
}

export function formatCurrentPrice(product) {
	return formatPrice(getCurrentPrice(product))
}