import time
import string
import random
import psycopg2
import base64
import copy
from api.utility import email_api
from api.utility.sql_manager import SqlManager
from passlib.hash import argon2
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables

from api.utility.stripe_api import StripeManager

MIN_PASSWORD_LENGTH = 6

class Labels:
	Email = "email"
	TimeStamp = "time_stamp"
	EmailConfirmationId = "email_confirmation_id"
	EmailConfirmed = "email_confirmed"
	Password = "password"
	PasswordConfirm = "password_confirm"
	AccountId = "account_id"
	Success = "success"
	Error = "error"
	UserInfo = "user_info"
	StripeCustomerId = "stripe_customer_id"
	Name = "name"

user_info_columns = [
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.Name, "type" : "TEXT"},
						{"name" : Labels.Email,		"type" : "TEXT"},
						{"name" : Labels.EmailConfirmationId, "type" : "TEXT"},
						{"name" : Labels.EmailConfirmed, "type": "BOOL"},
						{"name" : Labels.Password, "type" : "TEXT"},
						{"name" : Labels.AccountId, "type" : "TEXT"},
						{"name" : Labels.StripeCustomerId, "type" : "TEXT"}
					]


class AccountManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.UserInfoTable or table_name == TestTables.UserInfoTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createUserInfoTable()

	# initializes a user info table 
	def createUserInfoTable(self):
		self.createTableIfNotExists()
		for col in user_info_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# generates a new email_confirmation_id
	def generateAccountId(self):
		return self.generateUniqueIdForColumn(Labels.AccountId)

	def tableHasAccountId(self, account_id):
		return self.tableHasEntryWithProperty(Labels.AccountId, account_id)

	# handles a new user email
	# first checks if the email is in the table
	# also checks if it's a real email too with a try/except in email_api.py
	# user_info is a dictioary right now
	# only takes a password, email and name as input
	def addUser(self, user_submission):
		if user_submission == None:
			return None
		user_info = copy.deepcopy(user_submission)

		is_valid_submission = self.isUserSubmissionValid(user_info)
		if not is_valid_submission[Labels.Success]:
			return is_valid_submission
		# we hard code the email and username to lower case
		user_info[Labels.AccountId] = self.generateAccountId()
		user_info[Labels.Password] = argon2.using(rounds=4).hash(user_info[Labels.Password])
		user_info[Labels.Email] = user_info[Labels.Email].lower()
		user_info[Labels.TimeStamp] =  time.time()
		user_info[Labels.EmailConfirmed] = False
		user_info[Labels.EmailConfirmationId] = is_valid_submission[Labels.EmailConfirmationId]
		user_info[Labels.StripeCustomerId] = StripeManager.createCustomerFromUser(user_info)
		user_info.pop(Labels.PasswordConfirm, None)
		self.insertDictIntoTable(user_info)
		user = self.getRowByKey(Labels.Email, user_info[Labels.Email])
		return {Labels.Success : True, Labels.UserInfo : user}

	# this is a WIP and will be updated to handle the correct user information
	# right now it requires the 
	# 1. passwords match
	# 2. email is a string (not sure why this wouldn't happen but it's there anyways)
	# 3. Email doesn't already exists
	# 4. password is at least 6 characters
	# 5. If the email address is real (based on smtplib email)
	def isUserSubmissionValid(self, user_info):
		output ={}
		input_email = user_info.get(Labels.Email)
		password = user_info.get(Labels.Password)
		password_confirm = user_info.get(Labels.PasswordConfirm)
		if password != password_confirm:
			output[Labels.Success] = False
			output[Labels.Error] = "Passwords do not match"
			return output
		if len(password) < MIN_PASSWORD_LENGTH:
			output[Labels.Success] = False
			output[Labels.Error] = "Password must be at least " + str(MIN_PASSWORD_LENGTH) + " characters"
			return output
		try:
			email = input_email.lower()
		except:
			output[Labels.Success] = False
			output[Labels.Error] = "Email is not a string"
			return output
		if self.tableHasEmail(email):
			output[Labels.Success] = False
			output[Labels.Error] = "This email exists already"
			return output
		email_confirmation_id = self.generateEmailConfirmationId()
		try:
			email_api.sendEmailConfirmation(email, email_confirmation_id)
		except:
			output[Labels.Success] = False
			output[Labels.Error] = "Invalid Email Address"
			return output
		
		return {Labels.Success : True, Labels.EmailConfirmationId : email_confirmation_id}

	## login info is a dictionary where the fields are user "email" and "password"
	def checkLogin(self, login_info):
		output = {}
		output[Labels.Success] = False
		user_info = self.getUserInfoFromEmail(login_info[Labels.Email])
		if user_info == None:
			output[Labels.Error] = "Email \'" + login_info[Labels.Email] + "\'  does not exist"
			return output
		password_matches = argon2.verify(login_info[Labels.Password], user_info[Labels.Password])
		if not password_matches:
			output[Labels.Error] = "Password does not match provided email"
			return output
		return {Labels.Success : True, Labels.UserInfo : user_info}

	# gets the user info from email
	# returns a dictionary of the row that matches the email given
	def getUserInfoFromEmail(self, email):
		return self.getRowByKey(Labels.Email, email)

	# generates a new email_confirmation_id
	def generateEmailConfirmationId(self):
		return self.generateUniqueIdForColumn(Labels.EmailConfirmationId)
		
	def tableHasConfirmationId(self, email_confirmation_id):
		return self.tableHasEntryWithProperty(Labels.EmailConfirmationId, email_confirmation_id)

	# returns true if the email is in the table
	def tableHasEmail(self, email):
		return self.tableHasEntryWithProperty(Labels.Email, email)

	# returns true if the email is confirmed
	# returns false if the email is not confirmed or does not exists
	def isEmailConfirmed(self, email):
		user_info = self.getUserInfoFromEmail(email)
		if user_info == None:
			return None
		return user_info[Labels.EmailConfirmed]

	# sets the 'email_confirmed' column to true for this e-mail
	def confirmEmail(self, email_confirmation_id):
		try:
			self.updateRowsByProperty(Labels.EmailConfirmationId, email_confirmation_id, Labels.EmailConfirmed, True)
			return {Labels.Success : True}
		except:
			return {Labels.Success : False}

	def deleteUserByEmail(self, email):
		self.deleteRowsFromTableByProperty(Labels.Email, email)

	# takes a dict with new settings
	# and updates the account with these new settings
	def updateSettings(self, account_id, new_settings):
		self.updateEntireRowByKey(Labels.AccountId, account_id, new_settings)


