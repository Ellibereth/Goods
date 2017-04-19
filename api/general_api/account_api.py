from flask import Blueprint, jsonify, request
import time
from api.models.user import User
from api.utility.table_names import ProdTables
from api.utility import email_api
from api.models.shared_models import db
from api.utility.stripe_api import StripeManager
from api.utility.labels import UserLabels as Labels
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil

account_api = Blueprint('account_api', __name__)

# checks the login information from a user 
@account_api.route('/checkLogin', methods = ['POST'])
def checkLogin():
	email = request.json.get(Labels.Email)
	input_password = request.json.get(Labels.Password)
	this_user = User.query.filter_by(email = email).first()
	if this_user == None:
		return JsonUtil.failure("Not a real user")
	if this_user.checkLogin(input_password):
		output = {Labels.User : this_user.toPublicDict(), Labels.Jwt : JwtUtil.create_jwt(this_user.toPublicDict())}
		return JsonUtil.successWithOutput(output)
	else:
		return JsonUtil.failure("Password is not correct")

# registers a user
@account_api.route('/registerUserAccount', methods = ['POST'])
def registerUserAccount():
	name = request.json.get(Labels.Name)
	email = request.json.get(Labels.Email)
	password = request.json.get(Labels.Password)
	password_confirm = request.json.get(Labels.PasswordConfirm)

	old_user = User.query.filter_by(email = email).first()
	if old_user != None:
		return JsonUtil.failure("Email already exists")
	if password != password_confirm:
		return JsonUtil.failure("Passwords do not match")
	try:
		email_confirmation_id = User.generateEmailConfirmationId()
		email_api.sendEmailConfirmation(email, email_confirmation_id)
	except:
		return JsonUtil.failure("Invald Email")
	new_user = User(name = name, email = email, password = password, 
		email_confirmation_id =email_confirmation_id)
	db.session.add(new_user)
	stripe_customer_id = StripeManager.createCustomer(name, email)
	new_user.stripe_customer_id = stripe_customer_id
	db.session.commit()
	return JsonUtil.success(Labels.User, new_user.toPublicDict())
	
# confirms the user email if that route is visited
@account_api.route('/confirmEmail', methods = ['POST'])
def confirmEmail():
	email_confirmation_id = request.json.get(Labels.EmailConfirmationId)
	this_user = User.query.filter_by(email_confirmation_id = email_confirmation_id).first()
	if this_user == None:
		return JsonUtil.failure("Email confirmation id doesn't go with any user")
	this_user.confirmEmail()
	return JsonUtil.success(Labels.User, this_user.toPublicDict())


# updates the user's settings
@account_api.route('/updateSettings', methods = ['POST'])
def updateSettings():
	jwt = request.json.get(Labels.Jwt)
	email = request.json.get(Labels.Email)
	new_settings = request.json.get(Labels.NewSettings)
	password = request.json.get(Labels.Password)
	this_user = User.query.filter_by(email = email).first()
	if this_user == None:
		return JsonUtil.failure("Not a real user")
	if not JwtUtil.validateJwtUser(jwt, this_user.account_id):
		return JsonUtil.jwt_failure()
	if not this_user.checkLogin(password):
		return JsonUtil.failure("Password is not correct")
	this_user.updateSettings(new_settings)
	output = {Labels.User : this_user.toPublicDict(), Labels.Jwt : JwtUtil.create_jwt(this_user.toPublicDict())}
	return JsonUtil.successWithOutput(output)


@account_api.route('/changePassword', methods = ['POST'])
def changePassword():
	email = request.json.get(Labels.Email)
	old_password = request.json.get(Labels.OldPassword)
	new_password = request.json.get(Labels.Password)
	new_password_confirm = request.json.get(Labels.PasswordConfirm)
	this_user = User.query.filter_by(email = email).first()
	if this_user == None:
		return JsonUtil.failure("Not a real user")
	if not JwtUtil.validateJwtUser(jwt, this_user.account_id):
		return JsonUtil.jwt_failure()
	if new_password == new_password_confirm:
		valid_password = this_user.changePassword(old_password, new_password)
		if valid_password:
			output = {Labels.User : this_user.toPublicDict(), Labels.Jwt : JwtUtil.create_jwt(this_user.toPublicDict())}
			return JsonUtil.successWithOutput(output)
		else:
			return JsonUtil.failure("Password is invalid")
	else:
		return JsonUtil.failure("Passwords don't match")

# use this to refresh user information on mounting of main.js
@account_api.route('/getUserInfo', methods = ['POST'])
def getUserInfo():
	jwt = request.json.get(Labels.Jwt)
	if jwt == None or jwt == "" or "undefined":
		return JsonUtil.jwt_failure()
	jwt_user = JwtUtil.getUserInfoFromJwt(jwt)
	if jwt_user == None:
		return JsonUtil.jwt_failure()
	return JsonUtil.successWithOutput({Labels.User : jwt_user, Labels.Jwt : JwtUtil.create_jwt(jwt_user)})


@account_api.route('/addCreditCard', methods = ['POST'])
def addCreditCard():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()

	user = User.query.filter_by(account_id = account_id).first()
	name = request.json.get(Labels.Name)
	address_city = request.json.get(Labels.AddressCity)
	address_country = request.json.get(Labels.AddressCountry)
	address_line1 = request.json.get(Labels.AddressLine1)
	address_line2 = request.json.get(Labels.AddressLine2)
	address_zip = request.json.get(Labels.AddressZip)
	exp_month = request.json.get(Labels.ExpMonth)
	exp_year = request.json.get(Labels.ExpYear)
	number = request.json.get(Labels.Number)
	cvc = request.json.get(Labels.Cvc)
	try:
		user.addCreditCard(user, address_city, address_country, address_line1, address_line2, 
			address_zip, exp_month, exp_year, number, cvc, name)
		return JsonUtil.success()
	except Exception as e:
		return JsonUtil.failure("Somehing went wrong \n " + e)

@account_api.route("/getUserCards", methods = ['POST'])
def getUserCards():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	user = User.query.filter_by(account_id = account_id).first()
	cards = user.getCreditCards()
	return JsonUtil.successWithOutput({Labels.Cards : cards})

@account_api.route('/addUserAddresses', methods = ['POST'])
def addUserAddresses():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()

	user = User.query.filter_by(account_id = account_id).first()
	if user == None:
		return JsonUtil.failure("User does not exist")

	name = request.json.get(Labels.Name)
	description = request.json.get(Labels.Description)
	address_city = request.json.get(Labels.AddressCity)
	address_country = request.json.get(Labels.AddressCountry)
	address_line1 = request.json.get(Labels.AddressLine1)
	address_line2 = request.json.get(Labels.AddressLine2)
	address_zip = request.json.get(Labels.AddressZip)
	address_state = request.json.get(Labels.AddressState)
	try:
		user.addAddress(description, name, address_line1, address_line2, address_city, address_state,
			address_zip, address_country)
		return JsonUtil.success()

	except Exception as e:
		return JsonUtil.failure("Somehing went wrong \n " + str(e))

@account_api.route("/getUserAddress", methods = ['POST'])
def getUserAddress():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	user = User.query.filter_by(account_id = account_id).first()
	if user == None:
		return JsonUtil.failure("User does not exist")

	addresses = user.getAddresses()
	return JsonUtil.successWithOutput({Labels.Addresses : addresses})

@account_api.route('/editUserAddress', methods = ['POST'])
def editUserAddress():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	user = User.query.filter_by(account_id = account_id).first()
	if user == None:
		return JsonUtil.failure("User does not exist")
	address_id = request.json.get(Labels.AddressId)
	name = request.json.get(Labels.Name)
	description = request.json.get(Labels.Description)
	address_city = request.json.get(Labels.AddressCity)
	address_country = request.json.get(Labels.AddressCountry)
	address_line1 = request.json.get(Labels.AddressLine1)
	address_line2 = request.json.get(Labels.AddressLine2)
	address_zip = request.json.get(Labels.AddressZip)
	address_state = request.json.get(Labels.AddressState)
	try:
		user.editAddress(address_id, description, name, address_line1, address_line2, address_city, address_state,
			address_zip, address_country)
		return JsonUtil.success()

	except Exception as e:
		return JsonUtil.failure("Somehing went wrong \n " + str(e))

@account_api.route('/deleteUserAddress', methods = ['POST'])
def deleteUserAddress():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	user = User.query.filter_by(account_id = account_id).first()
	if user == None:
		return JsonUtil.failure("User does not exist")
	address_id = request.json.get(Labels.AddressId)
	
	try:
		user.deleteAddress(address_id)
		return JsonUtil.success()

	except Exception as e:
		return JsonUtil.failure("Somehing went wrong \n " + str(e))

	

