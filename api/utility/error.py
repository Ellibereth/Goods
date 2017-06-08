
class ErrorMessages:
	InvalidCredentials = "Credential are not correct"
	IpBlocked = "Your IP has been blocked for spamming login attempts. Try again in 15 minutes"
	ExistingEmail = "Email already exists"
	PasswordConfirmMismatch = "Passwords do not match"
	BlankName = "Name cannot be blank"
	BlankEmail = "Email cannot be blank"
	InvalidName = "Name must be alphabetical characters only"
	InvalidEmail ="Invald Email"
	NonExistantEmailConfirmation = "Email confirmation id doesn't go with any user"
	InvalidUser = "Not a real user"
	CardAddError = "Something went wrong while adding credit card"
	AddressAddError = "Something went wrong while adding address"
	AddressEditError = "Something went wrong while editing address"
	AddressDeleteError = "Something went wrong while deleting address"
	CardDeleteError = "Something went wrong while deleting card"
	ExpiredLink = "This link is invalid or has expired"
	BlankPassword = "Passwords cannot be blank"
	CartAddError = "Something went wrong while adding item to cart"
	AddressUserMismatch = "Address does not go with this user"
	CartPriceCalculationError = "Error calculating price of cart"
	CartCheckoutGeneralError = "There was an error with checking out your cart. Please check your cart and try again. \n \
			If you continue to have issues, do not hesitate to contact customer service."
	CartCheckoutPaymentError = "Something went wrong while trying to process payment information. Please check your billing information and try again."
	CartCheckoutEmailError = "Unfortunately we couldn't send you confirmation email, but this order can be viewed in settings / past orders.\
				 We are working on this and you can expect a confirmation email within 1-2 days"
	InvalidProduct = "Product doesn't exist"
	CartUpdateQuantity = "Something went wrong while updating cart quantity"

	def invalidEmail(email):
		return email + " is not a valid email address."

	def inUseEmail(email):
		return email + " is associated with another account"

	def itemLimit(limit):
		return "You can't order more than " + limit + " of this"

