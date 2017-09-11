var dateFormat = require('dateformat');


// takes price as float, outputs it into USD currency
// price is taken in an integer for number of cents
export function formatPrice(price){
    if (isNaN(price)) {
        return ""
    }
    if (price == 0){
        return "0.00"
    }
	var dollars = price / 100
	return dollars.toFixed(2);
}

export function formatDate(date){
	var local_date = new Date(date)
	var formatted_date = dateFormat(local_date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
	return formatted_date
}

export function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export function getCurrentPrice(product){
    if (!product)  {
        return ""
    }
    else {
        return product.price
    }
}

export function formatCurrentPrice(product) {
    return formatPrice(getCurrentPrice(product))
}