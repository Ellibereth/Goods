import time
import string
import random
import psycopg2
import base64
from api.utility import email_api
from api.utility.sql_manager import SqlManager
from passlib.hash import argon2
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables

MIN_PASSWORD_LENGTH = 6
user_info_columns = [
						{"name" : "time_stamp", "type" : "FLOAT"},
						{"name" : "email",		"type" : "TEXT"},
						{"name" : "email_confirmation_id", "type" : "TEXT"},
						{"name" : "email_confirmed", "type": "BOOL"},
						{"name" : "password", "type" : "TEXT"},
						{"name" : "account_id", "type" : "TEXT"}
					]

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

class AccountManager(SqlManager):
	def __init__(self, test = False):
		if test:
			self.table_name = TestTables.UserInfoTable
		else:
			self.table_name = ProdTables.UserInfoTable
		SqlManager.__init__(self, self.table_name)

	# initializes a user info table 
	def createUserInfoTable(self):
		self.createNewTableIfNotExists()
		for col in user_info_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# generates a new email_confirmation_id
	def generateAccountId(self):
		return self.generateUniqueIdForColumn(Labels.AccountId)

	def tableHasFeedbackId(self, account_id):
		column_name = Labels.AccountId
		entry_data = account_id
		return self.tableHasEntryWithProperty(column_name, entry_data)

	# handles a new user email
	# first checks if the email is in the table
	# also checks if it's a real email too with a try/except in email_api.py
	# user_info is a dictioary right now
	def addUser(self, user_info):
		self.createNewTableIfNotExists()
		is_valid_submission = self.isUserSubmissionValid(user_info)
		if not valid_submission[Labels.Success]:
			return is_valid_submission

		output = {}
		# we hard code the email and username to lower case
		user_info[Lables.AccountId] = self.generateAccountId()
		user_info[Labels.Password] = argon2.using(rounds=4).hash(user_info[Labels.Password])
		user_info[Labels.Email] = user_info[Labels.Email].lower()
		user_info[Labels.TimeStamp] = time_stamp = time.time()
		user_info[Labels.EmailConfirmed] = False
		user_info[Labels.EmailConfirmationId] = is_valid_submission[Lagels.EmailConfirmationId]
		self.insertDictToTable(user_info)
		output[Labels.Success] = True
		return output

	# this is a WIP and will be updated to handle the correct user information
	def isUserCreationValid(self, user_info):
		output ={}
		email = user_info.get(Labels.Email)
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
		output[Labels.EmailConfirmationId] = email_confirmation_id
		try:
			email_api.sendEmailConfirmation(email, email_confirmation_id)
		except:
			output[Labels.Success] = False
			output[Labels.Error] = "Invalid Email Address"
			return output
		output[Labels.Success] = True
		return output

	## login info is a dictionary where the fields are user "email" and "password"
	def checkLogin(self, login_info):
		output = {}
		output[Labels.Succss] = False
		user_info = self.getUserInfoFromEmail(login_info[Labels.Email])
		if user_info == None:
			output[Labels.Error] = "Email does not exist"
			return output
		password_matches = argon2.verify(login_info[Labels.Password], user_info[Labels.Password])
		if not password_matches:
			output[Labels.Error] = "Password does not match provided email"
			return output
		output[Labels.Success] = True
		output[Labels.UserInfo] = user_info
		return output

	# gets the user info from email
	# returns a dictionary of the row that matches the email given
	def getUserInfoFromEmail(self, email):
		return self.getRowByUniqueProperty(Labels.Email, email)

	# generates a new email_confirmation_id
	def generateEmailConfirmationId(self):
		return self.generateUniqueIdForColumn(Labels.EmailConfirmationId)
		
	def tableHasConfirmationId(self, email_confirmation_id):
		column_name = Labels.EmailConfirmationId
		entry_data = email_confirmation_id
		return self.tableHasEntryWithProperty(column_name, entry_data)

	# returns true if the email is in the table
	def tableHasEmail(self, email):
		column_name = Labels.Email
		entry_data = email
		return self.tableHasEntryWithProperty(column_name, entry_data)

	# returns true if the email is confirmed
	# returns false if the email is not confirmed or does not exists
	# I understand the 'email' magic string, still thinking the best way to handle it right now
	# how to make a Labels like class for all the db management
	def isEmailConfirmed(self, email):
		table_data = self.tableToDict()
		is_confirmed = False
		for row in table_data:
			if row[Labels.Email] == email.lower():
				if row[Labels.EmailConfirmed] == True:
					is_confirmed = True
					break
		return is_confirmed

	# sets the 'email_confirmed' column to true for this e-mail
	def confirmEmail(self, email_confirmation_id):
		key_column_name = Labels.EmailConfirmationId
		key = email_confirmation_id
		target_column_name = Lables.EmailConfirmed
		data = True
		self.updateEntryByKey(key_column_name, key, target_column_name, data)
		output = {}
		output[Labels.Success] = True
		return output
