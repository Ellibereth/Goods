export function isNumberKey(event) {
	const re = /^[0-9\b]+$/;
	return (event.target.value == '' || re.test(event.target.value)) 
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