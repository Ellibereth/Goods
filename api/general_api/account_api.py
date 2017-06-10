from flask import Blueprint, jsonify, request
import time
import datetime
from api.models.user import User
from api.utility.table_names import ProdTables
from api.utility import email_api
from api.models.shared_models import db
from api.utility.stripe_api import StripeManager
from api.utility.labels import UserLabels as Labels
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil
from api.models.cart import Cart
from api.security.tracking import LoginAttempt
from api.utility.error import ErrorMessages
from api.general_api import decorators

from validate_email import validate_email




account_api = Blueprint('account_api', __name__)

# checks the login information from a user 
@account_api.route('/checkLogin', methods = ['POST'])
def checkLogin():
	email_input = request.json.get(Labels.Email)
	input_password = request.json.get(Labels.Password)
	if isinstance(email_input, str):
		email = email_input.lower()
	else:
		return JsonUtil.failure(InvalidCredentials)
	ip = request.remote_addr
	if LoginAttempt.blockIpAddress(ip):
		LoginAttempt.addLoginAttempt(email, ip, success = False, is_admin = False)
		return JsonUtil.failure(ErrorMessages.IpBlocked)

	this_user = User.query.filter_by(email = email).first()
	if this_user == None:
		LoginAttempt.addLoginAttempt(email, ip, success = False, is_admin = False)
		return JsonUtil.failure(ErrorMessages.InvalidCredentials)

	if this_user.checkLogin(input_password):
		user_jwt = JwtUtil.create_jwt(this_user.toJwtDict())
		user_info = this_user.toPublicDictFast()
		output = {Labels.User : user_info,
			Labels.Jwt : user_jwt}
		LoginAttempt.addLoginAttempt(email, ip, success = True, is_admin = False)
		return JsonUtil.successWithOutput(output)
	else:
		LoginAttempt.addLoginAttempt(email, ip, success = False, is_admin = False)
		return JsonUtil.failure(ErrorMessages.InvalidCredentials)


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
	else:
		return JsonUtil.failure(ErrorMessages.InvalidCredentials)


# registers a user
@account_api.route('/registerUserAccount', methods = ['POST'])
def registerUserAccount():
	name = request.json.get(Labels.Name)
	email_input = request.json.get(Labels.Email)
	password = request.json.get(Labels.Password)
	password_confirm = request.json.get(Labels.PasswordConfirm)
	if isinstance(email_input, str):
		email = email_input.lower()
	else:
		return JsonUtil.failure(ErrorMessages.InvalidEmail)
	if email == "":
		return JsonUtil.failure(ErrorMessages.BlankEmail)
	old_user = User.query.filter_by(email = email).first()
	if old_user != None:
		return JsonUtil.failure(ErrorMessages.ExistingEmail)
	if name == "":
		return JsonUtil.failure(ErrorMessages.BlankName)
	if not isinstance(name, str):
		return JsonUtil.failure(ErrorMessages.InvalidName)
	if len(name) > User.NAME_MAX_LENGTH:
		return JsonUtil.failure(ErrorMessages.LongName)

	if not all(x.isalpha() or x.isspace() for x in name):
		return JsonUtil.failure(ErrorMessages.InvalidName)

	if not validate_email(email,verify=True):
		return JsonUtil.failure(ErrorMessages.InvalidEmail)

	try:
		email_confirmation_id = User.generateEmailConfirmationId()
		email_api.sendEmailConfirmation(email, email_confirmation_id, name)
	except Exception as e:
		print(str(e))
		return JsonUtil.failure(ErrorMessages.InvalidEmail)

	if len(password) < User.MIN_PASSWORD_LENGTH:
		return JsonUtil.failure(ErrorMessages.ShortPassword)
	if password != password_confirm:
		return JsonUtil.failure(ErrorMessages.PasswordConfirmMismatch)

	new_user = User(name = name, email = email, password = password, 
		email_confirmation_id =email_confirmation_id)
	db.session.add(new_user)
	db.session.commit()
	return JsonUtil.successWithOutput({
			Labels.User : new_user.toPublicDict(),
			Labels.Jwt : JwtUtil.create_jwt(new_user.toJwtDict())
		})
	
# confirms the user email if that route is visited
@account_api.route('/confirmEmail', methods = ['POST'])
def confirmEmail():
	email_confirmation_id = request.json.get(Labels.EmailConfirmationId)
	this_user = User.query.filter_by(email_confirmation_id = email_confirmation_id).first()

	if this_user == None:
		return JsonUtil.failure(ErrorMessages.NonExistantEmailConfirmation)
	else:
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
	password = request.json.get(Labels.Password)
	if not this_user.checkLogin(password):
		return JsonUtil.failure(ErrorMessages.InvalidCredentials)
	if not User.isValidEmail(new_settings[Labels.Email]):
		return JsonUtil.failure(ErrorMessages.invalidEmail(new_settings[Labels.Email]))

	if new_settings.get(Labels.Name) == "":
		return JsonUtil.failure(ErrorMessages.BlankName)
	if not isinstance(new_settings.get(Labels.Name), str):
		return JsonUtil.failure(ErrorMessages.InvalidName)
	if len(new_settings.get(Labels.Name)) > User.NAME_MAX_LENGTH:
		return JsonUtil.failure(ErrorMessages.LongName)
	if not validate_email(new_settings.get(Labels.Email),verify=True):
		return JsonUtil.failure(ErrorMessages.InvalidEmail)

	email_match = User.query.filter_by(email = new_settings[Labels.Email]).first()
	if email_match:
		if email_match.account_id != this_user.account_id:
			return JsonUtil.failure(ErrorMessages.inUseEmail(new_settings[Labels.Email]))
	if new_settings[Labels.Name] == "":
		return JsonUtil.failure(ErrorMessages.BlankName)
	if not all(x.isalpha() or x.isspace() for x in new_settings[Labels.Name]):	
		return JsonUtil.failure(ErrorMessages.InvalidName)
	this_user.updateSettings(new_settings)
	output = {Labels.User : this_user.toPublicDict(), Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict())}
	return JsonUtil.successWithOutput(output)

@account_api.route('/changePassword', methods = ['POST'])
@decorators.check_user_jwt
def changePassword(this_user):
	old_password = request.json.get(Labels.OldPassword)
	new_password = request.json.get(Labels.Password)
	new_password_confirm = request.json.get(Labels.PasswordConfirm)
	if new_password == new_password_confirm:
		valid_password = this_user.changePassword(old_password, new_password)
		if valid_password:
			output = {Labels.User : this_user.toPublicDict(), Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict())}
			return JsonUtil.successWithOutput(output)
		else:
			return JsonUtil.failure(ErrorMessages.InvalidCredentials)
	else:
		return JsonUtil.failure(ErrorMessages.InvalidCredentials)


@account_api.route('/addCreditCard', methods = ['POST'])
@decorators.check_user_jwt
def addCreditCard(this_user):
	name = request.json.get(Labels.Name)
	address_city = request.json.get(Labels.AddressCity)
	address_country = request.json.get(Labels.AddressCountry)
	address_line1 = request.json.get(Labels.AddressLine1)
	address_line2 = request.json.get(Labels.AddressLine2)
	address_state = request.json.get(Labels.AddressState)
	address_zip = request.json.get(Labels.AddressZip)
	exp_month = int(request.json.get(Labels.ExpMonth))
	exp_year = int(request.json.get(Labels.ExpYear))
	number = request.json.get(Labels.Number)
	cvc = request.json.get(Labels.Cvc)
	add_card_response = this_user.addCreditCard(address_city, address_line1, address_line2, 
		address_zip, exp_month, exp_year, number, cvc, name, address_state, address_country)
	
	if add_card_response.get(Labels.Success):
		return JsonUtil.successWithOutput(add_card_response)
	else:
		return JsonUtil.failureWithOutput(add_card_response)

@account_api.route("/getUserCards", methods = ['POST'])
@decorators.check_user_jwt
def getUserCards(this_user):
	cards = this_user.getCreditCards()
	return JsonUtil.successWithOutput({Labels.Cards : cards})

@account_api.route('/addUserAddresses', methods = ['POST'])
@decorators.check_user_jwt
def addUserAddresses(this_user):
	name = request.json.get(Labels.AddressName)
	description = request.json.get(Labels.Description)
	address_city = request.json.get(Labels.AddressCity)
	address_country = request.json.get(Labels.AddressCountry)
	address_line1 = request.json.get(Labels.AddressLine1)
	address_line2 = request.json.get(Labels.AddressLine2)
	address_zip = request.json.get(Labels.AddressZip)
	address_state = request.json.get(Labels.AddressState)


	add_address_response = this_user.addAddress(description, name, address_line1, address_line2, address_city, address_state,
		address_zip, address_country)
	if add_address_response.get(Labels.Success):
		return JsonUtil.successWithOutput(add_address_response)
	else:
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
		this_user.editAddress(address_id, description, name, address_line1, address_line2, address_city, address_state,
			address_zip, address_country)
		return JsonUtil.success()

	except Exception as e:
		print(str(e))
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
@decorators.check_user_jwt
def getUserInfo(this_user):
	adjusted_items = this_user.adjustCart()
	return JsonUtil.successWithOutput({
			Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict()),
			Labels.User : this_user.toPublicDict(),
			Labels.AdjustedItems : adjusted_items
		})


@account_api.route('/softDeleteAccount', methods = ['POST'])
@decorators.check_user_jwt
def softDeleteAccount(this_user):
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
	email_api.sendEmailConfirmation(this_user.email, this_user.email_confirmation_id, this_user.name)
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
	if email == None or email == "":
		return JsonUtil.failure(ErrorMessages.BlankEmail)
	user = User.query.filter_by(email = email).first()
	if user:
		user.setRecoveryPin()
		email_api.sendRecoveryEmail(user)
		return JsonUtil.success()
	else:
		return JsonUtil.success()


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
		return JsonUtil.failure(ExpiredLink)


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



