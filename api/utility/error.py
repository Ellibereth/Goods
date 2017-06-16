NAME_MAX_LENGTH = 24
MIN_PASSWORD_LENGTH = 6

class Labels:
	Type = "type"
	Text = "text"
	Error = "error"
	Title = "title"


# title is large bolded text
# text is small non-bold text
class SwalError:
	type = Labels.Error

	def __init__(self, title, text = ""):
		self.title = title
		self.text = text

	def toDict(self):
		public_dict = {}
		public_dict[Labels.Title] = self.title
		public_dict[Labels.Text] = self.text
		public_dict[Labels.Type] = self.type
		return public_dict

class ErrorMessages:
	InvalidCredentials = SwalError("Incorrect username or password.").toDict()
	IpBlocked = SwalError("You've failed to login too many times.", "Try again in 15 minutes.").toDict()
	ExistingEmail = SwalError("Email already exists.").toDict()
	PasswordConfirmMismatch = SwalError("Passwords do not match.").toDict()
	BlankName = SwalError("Name cannot be blank.").toDict()
	BlankEmail = SwalError("Email cannot be blank.").toDict()
	InvalidName = SwalError("Name must be alphabetical characters only").toDict()
	InvalidEmail = SwalError("Invald Email").toDict()
	CardAddError = SwalError("Something went wrong while adding credit card").toDict()
	AddressAddError = SwalError("Something went wrong while adding address").toDict()
	AddressEditError = SwalError("Something went wrong while editing address").toDict()
	AddressDeleteError = SwalError("Something went wrong while deleting address").toDict()
	CardDeleteError = SwalError("Something went wrong while deleting card").toDict()
	ExpiredLink = SwalError("This link is invalid or has expired.").toDict()
	BlankPassword = SwalError("Passwords cannot be blank.").toDict()
	CartAddError = SwalError("Something went wrong while adding item to cart").toDict()
	AddressUserMismatch = SwalError("Address does not go with this user.").toDict()
	CartPriceCalculationError = SwalError("Error calculating price of cart").toDict()
	CartCheckoutGeneralError = SwalError("There was an error with checking out your cart. Please check your cart and try again. \n \
			If you continue to have issues, do not hesitate to contact customer service.").toDict()
	CartCheckoutPaymentError = SwalError("Something went wrong while trying to process payment information. Please check your billing information and try again.").toDict()
	CartCheckoutEmailError = SwalError("Unfortunately we couldn't send you confirmation email, but this order can be viewed in settings / past orders.\
				 We are working on this and you can expect a confirmation email within 1-2 days").toDict()
	InvalidProduct = SwalError("Product doesn't exist.").toDict()
	CartUpdateQuantity = SwalError("Something went wrong while updating cart quantity.").toDict()
	LongName = SwalError("Name must be less than " + str(NAME_MAX_LENGTH) + " characters.").toDict()
	ShortPassword = SwalError("Password must be at least " + str(MIN_PASSWORD_LENGTH) + " characters.").toDict()
	BlankCity = SwalError("City cannot be blank.").toDict()
	BlankAddressLine = SwalError("Address cannot be blank.").toDict()
	BlankZip = SwalError("ZIP Code cannot be blank.").toDict()
	BlankState = SwalError("State cannot be blank.").toDict()
	BlankCountry = SwalError("Country cannot be blank.").toDict()
	CardNumberError = SwalError("Invalid card number.").toDict()
	CardExpiryError = SwalError("Invalid expirateion date.").toDict()
	CardCvcError = SwalError("Card CVC invalid").toDict()
	CardZipError = SwalError("Card ZIP invalid").toDict()

	def invalidEmail(email):
		return SwalError(email + " is not a valid email address.").toDict()

	def inUseEmail(email):
		return SwalError(email + " is associated with another account").toDict()

	def itemLimit(limit):
		if limit == 0:
			return SwalError("You can't order more than " + limit + " more of this").toDict()
		else:
			return SwalError("You can't order more than " + limit + " more of this").toDict()

