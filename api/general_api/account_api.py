from flask import Blueprint, jsonify, request
import time
from passlib.hash import argon2
from ..utility.account_manager import AccountManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	EmailConfirmationId = "email_confirmation_id"
	Name = "name"
	Email = "email"
	Password = "password"
	PasswordConfirm = "password_confirm"
	
register_keys = [Labels.Name, Labels.Email, Labels.Password, Labels.PasswordConfirm]

account_api = Blueprint('account_api', __name__)

@account_api.route('/checkLogin', methods = ['POST'])
def checkLogin():
	user_info = {}
	output = {}
	for key in register_keys:
		if request.json.get(key) != None:
			user_info[key] = request.json.get(key)
	account_manager = AccountManager(ProdTables.UserInfoTable)
	output = account_manager.checkLogin(user_info)
	account_manager.closeConnection()
	return jsonify(output)


@account_api.route('/registerUserAccount', methods = ['POST'])
def registerUserAccount():
	user_info = {}
	output = {}
	for key in register_keys:
		if request.json.get(key) != None:
			user_info[key] = request.json.get(key)
	account_manager = AccountManager(ProdTables.UserInfoTable)
	output = account_manager.addUser(user_info)
	account_manager.closeConnection()
	return jsonify(output)

@account_api.route('/confirmEmail', methods = ['POST'])
def confirmEmail():
	email_confirmation_id = request.json.get(Labels.EmailConfirmationId)
	account_manager = AccountManager(ProdTables.UserInfoTable)
	output = account_manager.confirmEmail(email_confirmation_id)
	account_manager.closeConnection()
	return jsonify(output)