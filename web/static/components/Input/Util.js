var dateFormat = require('dateformat');

export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// takes price as float, outputs it into USD currency
export function formatPrice(price){
		if (!price) {
			if (price == 0) {
				return "0.00"
			}
			else {
				return ""	
			}
		}
		var decimal_splits = price.toString().split('.')
		var dollars = decimal_splits[0]
		var cents = decimal_splits[1]
		if (!cents){
			cents = "00"
		}
		else if (cents.length == 1) {
			cents = cents + "0"
		}

		cents = cents.substring(0,2)
		return dollars + "." + cents
}

export function formatDate(date){
	var local_date = new Date(date)
	var formatted_date = dateFormat(local_date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
	return formatted_date
}