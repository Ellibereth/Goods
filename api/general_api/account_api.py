import os
import datetime
from validate_email import validate_email

from flask import Blueprint, request
from api.models.user import User
from api.utility.email import EmailLib
from api.models.shared_models import db
from api.utility.labels import UserLabels as Labels
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil
from api.security.tracking import LoginAttempt
from api.utility.error import ErrorMessages
from api.general_api import decorators
from api.models.launch_list_email import LaunchListEmail

account_api = Blueprint('account_api', __name__)

# checks the login information from a user
@account_api.route('/checkLogin', methods = ['POST'])
def checkLogin():
	email_input = request.json.get(Labels.Email)
	input_password = request.json.get(Labels.Password)
	if email_input == "":
		return JsonUtil.failure(ErrorMessages.BlankEmail)
	if isinstance(email_input, str):
		email = email_input.lower()
	else:
		return JsonUtil.failure(ErrorMessages.InvalidCredentials)
	ip = request.remote_addr

	if os.environ.get("ENVIRONMENT") == "PRODUCTION":
		if LoginAttempt.blockIpAddress(ip):
			return JsonUtil.failure(ErrorMessages.IpBlocked)

	this_user = User.query.filter_by(email = email).first()
	if this_user is None:
		LoginAttempt.addLoginAttempt(email, ip, success = False, is_admin = False)
		return JsonUtil.failure(ErrorMessages.InvalidCredentials)
	# this part for facebook login will need to be changed
	# elif this_user.isFacebookUser():
	# 	LoginAttempt.addLoginAttempt(email, ip, success = False, is_admin = False)
	# 	return JsonUtil.failure(ErrorMessages.InvalidCredentials)
	if this_user.checkLogin(input_password):
		guest_jwt = request.json.get(Labels.GuestJwt)
		if guest_jwt:
			guest_user = JwtUtil.getUserInfoFromJwt(guest_jwt)
			this_user.transferGuestCart(guest_user)
		user_jwt = JwtUtil.create_jwt(this_user.toJwtDict())
		user_info = this_user.toPublicDict()
		output = {Labels.User : user_info, Labels.Jwt : user_jwt}
		LoginAttempt.addLoginAttempt(email, ip, success = True, is_admin = False)
		return JsonUtil.successWithOutput(output)
	else:
		LoginAttempt.addLoginAttempt(email, ip, success = False, is_admin = False)
		return JsonUtil.failure(ErrorMessages.InvalidCredentials)

# checks the login information from a user
# once they are logged in, mostly used for making changes to settings
@account_api.route('/createGuestUser', methods = ['POST'])
def createGuestUser():
	create_guest_user = User.createGuestUser()
	create_guest_user[Labels.Jwt] = JwtUtil.create_jwt(create_guest_user[Labels.User])
	return JsonUtil.successWithOutput(create_guest_user)

# checks the login information from a user
# once they are logged in, mostly used for making changes to settings
@account_api.route('/checkPassword', methods = ['POST'])
@decorators.check_user_jwt
def checkPassword(this_user):
	input_password = request.json.get(Labels.Password)
	if this_user.checkLogin(input_password):
		output = {
			Labels.User : this_user.toPublicDict(),
			Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict())
		}
		return JsonUtil.successWithOutput(output)
	return JsonUtil.failure(ErrorMessages.InvalidCredentials)


# registers a user
@account_api.route('/registerUserAccount', methods = ['POST'])
def registerUserAccount():
	name = request.json.get(Labels.Name)
	email_input = request.json.get(Labels.Email)
	password = request.json.get(Labels.Password)
	password_confirm = request.json.get(Labels.PasswordConfirm)
	guest_jwt = request.json.get(Labels.GuestJwt)
	guest_user = JwtUtil.getUserInfoFromJwt(guest_jwt)
	ip_addr = request.remote_addr
	nums = [int(s) for s in ip_addr.split() if s.isdigit()]
	ab_group = sum(nums) % 2
	register_user_response = User.registerUser(name, email_input, password,
									password_confirm, guest_user, ab_group = ab_group)
	if register_user_response.get(Labels.Success):
		register_user_response[Labels.Jwt] = JwtUtil.create_jwt(register_user_response[Labels.Jwt])
		return JsonUtil.successWithOutput(register_user_response)
	return JsonUtil.failureWithOutput(register_user_response)

# confirms the user email if that route is visited
@account_api.route('/confirmEmail', methods = ['POST'])
def confirmEmail():
	email_confirmation_id = request.json.get(Labels.EmailConfirmationId)
	this_user = User.query.filter_by(email_confirmation_id = email_confirmation_id).first()
	if this_user is None:
		return JsonUtil.failure()
	this_user.confirmEmail()
	return JsonUtil.successWithOutput({
		Labels.User : this_user.toPublicDict(),
		Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict())
	})

# updates the user's settings
@account_api.route('/updateSettings', methods = ['POST'])
@decorators.check_user_jwt
def updateSettings(this_user):
	new_settings = request.json.get(Labels.NewSettings)

	if new_settings.get(Labels.Name) == "":
		return JsonUtil.failure(ErrorMessages.BlankName)
	if not new_settings.get(Labels.Email):
		return JsonUtil.failure(ErrorMessages.BlankEmail)
	if not User.isValidEmail(new_settings[Labels.Email]):
		return JsonUtil.failure(ErrorMessages.invalidEmail(new_settings[Labels.Email]))
	if not isinstance(new_settings.get(Labels.Name), str):
		return JsonUtil.failure(ErrorMessages.InvalidName)
	if len(new_settings.get(Labels.Name)) > User.NAME_MAX_LENGTH:
		return JsonUtil.failure(ErrorMessages.LongName)
	if not validate_email(new_settings.get(Labels.Email)):
		return JsonUtil.failure(ErrorMessages.InvalidEmail)

	email_match = User.query.filter_by(email = new_settings[Labels.Email].lower()).first()
	if email_match:
		if email_match.account_id != this_user.account_id:
			return JsonUtil.failure(ErrorMessages.inUseEmail(new_settings[Labels.Email]))
	if new_settings[Labels.Name] == "":
		return JsonUtil.failure(ErrorMessages.BlankName)
	# if not all(x.isalpha() or x.isspace() for x in new_settings[Labels.Name]):
	# 	return JsonUtil.failure(ErrorMessages.InvalidName)
	response = this_user.updateSettings(new_settings)
	return JsonUtil.successWithOutput(response)

@account_api.route('/changePassword', methods = ['POST'])
@decorators.check_user_jwt
def changePassword(this_user):
	old_password = request.json.get(Labels.OldPassword)
	new_password = request.json.get(Labels.Password)
	new_password_confirm = request.json.get(Labels.PasswordConfirm)
	if new_password == new_password_confirm:
		valid_password = this_user.changePassword(old_password, new_password)
		if valid_password:
			output = {
				Labels.User : this_user.toPublicDict(),
				Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict())
			}
			return JsonUtil.successWithOutput(output)
		return JsonUtil.failure(ErrorMessages.InvalidCredentials)
	return JsonUtil.failure(ErrorMessages.InvalidCredentials)


@account_api.route('/addCreditCard', methods = ['POST'])
@decorators.check_user_jwt
def addCreditCard(this_user):
	name = request.json.get(Labels.Name)
	address_name = request.json.get(Labels.AddressName)
	address_city = request.json.get(Labels.AddressCity)
	address_country = request.json.get(Labels.AddressCountry)
	address_line1 = request.json.get(Labels.AddressLine1)
	address_line2 = request.json.get(Labels.AddressLine2)
	address_state = request.json.get(Labels.AddressState)
	address_zip = request.json.get(Labels.AddressZip)
	exp_month = request.json.get(Labels.ExpMonth)
	exp_year = request.json.get(Labels.ExpYear)
	number = request.json.get(Labels.Number)
	cvc = request.json.get(Labels.Cvc)

	add_card_response = this_user.addCreditCard(address_name, address_city, address_line1,
		address_line2, address_zip, exp_month, exp_year,
		number, cvc, name, address_state, address_country)

	if add_card_response.get(Labels.Success):
		return JsonUtil.successWithOutput(add_card_response)
	return JsonUtil.failureWithOutput(add_card_response)

@account_api.route("/getUserCards", methods = ['POST'])
@decorators.check_user_jwt
def getUserCards(this_user):
	cards = this_user.getCreditCards()
	return JsonUtil.successWithOutput({Labels.Cards : cards})

@account_api.route('/addUserAddress', methods = ['POST'])
@decorators.check_user_jwt
def addUserAddress(this_user):
	name = request.json.get(Labels.AddressName)
	description = request.json.get(Labels.Description)
	address_city = request.json.get(Labels.AddressCity)
	address_country = request.json.get(Labels.AddressCountry)
	address_line1 = request.json.get(Labels.AddressLine1)
	address_line2 = request.json.get(Labels.AddressLine2)
	address_zip = request.json.get(Labels.AddressZip)
	address_state = request.json.get(Labels.AddressState)

	add_address_response = this_user.addAddress(description, name,
		address_line1, address_line2, address_city, address_state,
		address_zip, address_country)
	if add_address_response.get(Labels.Success):
		return JsonUtil.successWithOutput(add_address_response)
	return JsonUtil.failureWithOutput(add_address_response)


@account_api.route("/getUserAddress", methods = ['POST'])
@decorators.check_user_jwt
def getUserAddress(this_user):
	addresses = this_user.getAddresses()
	return JsonUtil.successWithOutput({Labels.Addresses : addresses})

@account_api.route('/editUserAddress', methods = ['POST'])
@decorators.check_user_jwt
def editUserAddress(this_user):
	address_id = request.json.get(Labels.AddressId)
	name = request.json.get(Labels.AddressName)
	description = request.json.get(Labels.Description)
	address_city = request.json.get(Labels.AddressCity)
	address_country = request.json.get(Labels.AddressCountry)
	address_line1 = request.json.get(Labels.AddressLine1)
	address_line2 = request.json.get(Labels.AddressLine2)
	address_zip = request.json.get(Labels.AddressZip)
	address_state = request.json.get(Labels.AddressState)
	try:
		this_user.editAddress(address_id, description, name, address_line1,
			address_line2, address_city, address_state,
			address_zip, address_country)
		return JsonUtil.success()

	except:
		return JsonUtil.failure(ErrorMessages.AddressEditError)

@account_api.route('/deleteUserAddress', methods = ['POST'])
@decorators.check_user_jwt
def deleteUserAddress(this_user):
	address_id = request.json.get(Labels.AddressId)
	try:
		this_user.deleteAddress(address_id)
		return JsonUtil.success()
	except:
		return JsonUtil.failure(ErrorMessages.AddressDeleteError)

@account_api.route('/deleteUserCreditCard', methods = ['POST'])
@decorators.check_user_jwt
def deleteUserCreditCard(this_user):
	card_id = request.json.get(Labels.StripeCardId)
	try:
		this_user.deleteCreditCard(card_id)
		return JsonUtil.success()
	except:
		return JsonUtil.failure(ErrorMessages.CardDeleteError)


@account_api.route('/getUserOrders', methods = ['POST'])
@decorators.check_user_jwt
def getUserOrders(this_user):
	orders = this_user.getUserOrders()
	return JsonUtil.successWithOutput({Labels.Orders : orders})

@account_api.route('/getUserInfo', methods = ['POST'])
@decorators.check_jwt
def getUserInfo(this_user):
	ip_addr = request.remote_addr
	nums = [int(s) for s in ip_addr.split() if s.isdigit()]
	ab_group = sum(nums) % 2
	if hasattr(this_user, 'is_admin'):
		if this_user.is_admin:
			admin_jwt = JwtUtil.create_jwt(this_user.toPublicDict())
			return JsonUtil.successWithOutput({
				Labels.User : this_user.toPublicDict(),
				"jwt" : admin_jwt})
		else:
			return JsonUtil.failure({"ab_group" : ab_group})

	else:
		if this_user:
			adjusted_items = this_user.adjustCart()
			public_user_dict = this_user.toPublicDict()
			return JsonUtil.successWithOutput({
					Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict()),
					Labels.User : public_user_dict,
					Labels.AdjustedItems : adjusted_items
				})

		return JsonUtil.failure({"ab_group" : ab_group})



@account_api.route('/softDeleteAccount', methods = ['POST'])
@decorators.check_user_jwt
def softDeleteAccount(this_user):
	if this_user.fb_id:
		this_user.softDeleteAccount()
	else:
		password = request.json.get(Labels.Password)
		password_confirm = request.json.get(Labels.PasswordConfirm)
		if password != password_confirm:
			return JsonUtil.failure(ErrorMessages.InvalidCredentials)
		if not this_user.checkLogin(password):
			return JsonUtil.failure(ErrorMessages.InvalidCredentials)
		this_user.softDeleteAccount()
	return JsonUtil.success()

@account_api.route('/resendConfirmationEmail', methods = ['POST'])
@decorators.check_user_jwt
def resendConfirmationEmail(this_user):
	EmailLib.sendEmailConfirmation(this_user.email, this_user.email_confirmation_id, this_user.name)
	return JsonUtil.success()


@account_api.route('/setDefaultAddress', methods = ['POST'])
@decorators.check_user_jwt
def setDefaultAddress(this_user):
	address_id = request.json.get(Labels.AddressId)
	this_user.default_address = address_id
	db.session.commit()
	return JsonUtil.success()

@account_api.route('/setDefaultCard', methods = ['POST'])
@decorators.check_user_jwt
def setDefaultCard(this_user):
	card_id = request.json.get(Labels.CardId)
	this_user.default_card = card_id
	db.session.commit()
	return JsonUtil.success()

@account_api.route('/setRecoveryPin', methods = ['POST'])
def setRecoveryPin():
	email = request.json.get(Labels.Email)
	if email is None or email == "":
		return JsonUtil.failure(ErrorMessages.BlankEmail)
	user = User.query.filter_by(email = email).first()
	if user:
		user.setRecoveryPin()
		EmailLib.sendRecoveryEmail(user)
		print(user.recovery_pin)
		return JsonUtil.success()
	else:
		return JsonUtil.failure()


@account_api.route('/checkRecoveryInformation', methods = ['POST'])
def checkRecoveryInformation():
	recovery_pin = request.json.get(Labels.RecoveryPin)
	user = User.query.filter_by(recovery_pin = recovery_pin).first()
	if user:
		if datetime.datetime.now() > user.recovery_pin_expiration:
			return JsonUtil.failure(ErrorMessages.ExpiredLink)
		else:
			return JsonUtil.success()
	else:
		return JsonUtil.failure(ErrorMessages.ExpiredLink)


@account_api.route('/recoverySetPassword', methods = ['POST'])
def recoverySetPassword():
	password = request.json.get(Labels.Password)
	password_confirm = request.json.get(Labels.PasswordConfirm)
	recovery_pin = request.json.get(Labels.RecoveryPin)
	user = User.query.filter_by(recovery_pin = recovery_pin).first()
	if not password or password == "" or not password_confirm or password_confirm == "":
		return JsonUtil.failure(ErrorMessages.BlankPassword)

	if password != password_confirm:
		return JsonUtil.failure(ErrorMessages.PasswordConfirmMismatch)

	if user:
		if user.recovery_pin_expiration:
			if datetime.datetime.now() > user.recovery_pin_expiration:
				return JsonUtil.failure(ErrorMessages.ExpiredLink)
			else:
				is_valid_password = User.validatePasswordSubimssion(password)
				if is_valid_password[Labels.Success]:
					print(password)
					user.setPasswordWithRecovery(password)
					return JsonUtil.success()
				else:
					return JsonUtil.failure(is_valid_password[Labels.Error])
		else:
			return JsonUtil.failure(ErrorMessages.ExpiredLink)
	else:
		return JsonUtil.failure(ErrorMessages.ExpiredLink)


@account_api.route('/readCartMessage', methods = ['POST'])
@decorators.check_user_jwt
def readCartMessage(this_user):
	this_user.cart_message = ""
	db.session.commit()
	return JsonUtil.success()

# get the correct FB app id
@account_api.route('/getFbAppId', methods = ['POST'])
def getFbAppId():
	environment = os.environ.get('ENVIRONMENT')
	app_id = ""
	if request.remote_addr == "127.0.0.1":
		app_id = "301430330267358"
	elif environment == "DEVELOPMENT":
		app_id = "255033931670343"
	elif environment == "STAGING":
		app_id = "333196410460893"
	elif environment == "PRODUCTION":
		app_id = "120813588560588"
	return JsonUtil.successWithOutput({"app_id" : app_id})

# registers a user with facebook
@account_api.route('/handleFacebookUser', methods = ['POST'])
def handleFacebookUser():
	fb_response = request.json.get(Labels.FbResponse)
	guest_jwt = request.json.get(Labels.Jwt)
	guest_user = JwtUtil.getUserInfoFromJwt(guest_jwt)
	fb_id = fb_response.get(Labels.Id)
	if fb_id is None:
		return JsonUtil.failure()

	fb_user = User.query.filter_by(fb_id = fb_response.get(Labels.Id)).first()

	# if the fb_user already has an account
	if fb_user:
		fb_user.transferGuestCart(guest_user)
		user_jwt = JwtUtil.create_jwt(fb_user.toJwtDict())
		user_info = fb_user.toPublicDict()
		output = {
			Labels.User : user_info,
			Labels.Jwt : user_jwt
		}
		return JsonUtil.successWithOutput(output)

	register_user_response = User.registerFacebookUser(fb_response, guest_user)
	if register_user_response.get(Labels.Success):
		register_user_response[Labels.Jwt] = JwtUtil.create_jwt(register_user_response[Labels.Jwt])
		return JsonUtil.successWithOutput(register_user_response)
	else:
		return JsonUtil.failureWithOutput(register_user_response)
	return JsonUtil.failure()


@account_api.route('/signUpForLandingList', methods = ['POST'])
def signUpForLandingList():
	email = request.json.get(Labels.Email)
	email_matches = LaunchListEmail.query.filter_by(email = email).first()
	if email_matches:
		return JsonUtil.failure("You've already subscribed")

	if not validate_email(email):
		return JsonUtil.failure("Invalid email, please try again")

	try:
		EmailLib.sendLaunchListEmail(email)
	except:
		return JsonUtil.failure("Error sending email, please try again")
	return JsonUtil.success()
