from flask import Blueprint, jsonify, request
import time
from api.models.user import User
from api.utility.table_names import ProdTables
from api.utility import email_api
from api.models.shared_models import db
from api.utility.stripe_api import StripeManager
from api.utility.labels import UserLabels as Labels

	
register_keys = [Labels.Name, Labels.Email, Labels.Password, Labels.PasswordConfirm]

account_api = Blueprint('account_api', __name__)

# checks the login information from a user 
@account_api.route('/checkLogin', methods = ['POST'])
def checkLogin():
	email = request.json.get(Labels.Email)
	input_password = request.json.get(Labels.Password)
	this_user = User.query.filter_by(email = email).first()
	if this_user.checkLogin(input_password):
		return jsonify({Labels.Success : True, Labels.User : this_user.toPublicDict()})
	else:
		return jsonify({Labels.Success : False, Labels.Error: "Password is not correct"})

# registers a user
@account_api.route('/registerUserAccount', methods = ['POST'])
def registerUserAccount():
	name = request.json.get(Labels.Name)
	email = request.json.get(Labels.Email)
	password = request.json.get(Labels.Password)
	password_confirm = request.json.get(Labels.PasswordConfirm)
	old_user = User.query.filter_by(email = email).first()
	if old_user != None:
		return jsonify({Labels.Success : False, Lables.Error : "Email already exists"})
	if password != password_confirm:
		return jsonify({Labels.Success : False, Labels.Error : "Passwords do not match"})
	try:
		email_confirmation_id = User.generateEmailConfirmationId()
		email_api.sendEmailConfirmation(email, email_confirmation_id)
	except:
		return jsonify({Labels.Success : False, Labels.Erorr : "Invald Email"})
	new_user = User(name = name, email = email, password = password, 
		email_confirmation_id =email_confirmation_id)
	db.session.add(new_user)
	stripe_customer_id = StripeManager.createCustomer(name, email)
	new_user.stripe_customer_id = stripe_customer_id
	db.session.commit()
	return jsonify({Labels.Success : True, Labels.User : new_user.toPublicDict()})
	


# confirms the user email if that route is visited
@account_api.route('/confirmEmail', methods = ['POST'])
def confirmEmail():
	email_confirmation_id = request.json.get(Labels.EmailConfirmationId)
	this_user = User.query.filter_by(email_confirmation_id = email_confirmation_id).first()
	if this_user == None:
		return jsonify({Labels.Success : False, Labels.Error : "Email confirmation id doesn't go with any user"})
	this_user.confirmEmail()
	return jsonify({Labels.Success : True, Labels.User : this_user.toPublicDict()})


# updates the user's settings
@account_api.route('/updateSettings', methods = ['POST'])
def updateSettings():
	email = request.json.get(Labels.Email)
	new_settings = request.json.get(Labels.NewSettings)
	password = request.json.get(Labels.Password)
	this_user = User.query.filter_by(email = email).first()
	if this_user == None:
		return jsonify({Labels.Success : False , Labels.Error : "Not a real user"})
	if not this_user.checkLogin(password):
		return jsonify({Labels.Success : False, Labels.Error: "Password is not correct"})
	this_user.updateSettings(new_settings)
	return jsonify({Labels.Success : True, Labels.User : this_user.toPublicDict()})


@account_api.route('/changePassword', methods = ['POST'])
def changePassword():
	email = request.json.get(Labels.Email)
	old_password = request.json.get(Labels.OldPassword)
	new_password = request.json.get(Labels.Password)
	new_password_confirm = request.json.get(Labels.PasswordConfirm)
	if new_password == new_password_confirm:
		this_user = User.query.filter_by(email = email).first()
		valid_password = this_user.changePassword(old_password, new_password)
		if not valid_password:
			return jsonify({Labels.Success : False, Labels.Error : "Password is invalid"})
		else:
			return jsonify({Labels.Success : True, Labels.User : this_user.toPublicDict()})
	else:
		return jsonify({Labels.Success : False, Labels.Error : "Passwords don't match"})

