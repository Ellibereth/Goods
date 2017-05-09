export function isNumberKey(event) {
	const re = /^[0-9\b]+$/;
	return (event.target.value == '' || re.test(event.target.value)) 
}

export function isNumeric(n) {
	var x = parseInt(n)
	var integers = [0,1,2,3,4,5,6,7,8,9]
	if (integers.indexOf(x) == -1)
		return false
	else
		return true


}