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
	def __init__(self, table_name):
		assert (table_name == ProdTables.UserInfoTable or table_name == TestTables.UserInfoTable)
		self.table_name = table_name
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
		return self.tableHasEntryWithProperty(Labels.AccountId, account_id)

	# handles a new user email
	# first checks if the email is in the table
	# also checks if it's a real email too with a try/except in email_api.py
	# user_info is a dictioary right now
	def addUser(self, user_info):
		self.createNewTableIfNotExists()
		is_valid_submission = self.isUserSubmissionValid(user_info)
		if not valid_submission[Labels.Success]:
			return is_valid_submission
		# we hard code the email and username to lower case
		user_info[Labels.AccountId] = self.generateAccountId()
		user_info[Labels.Password] = argon2.using(rounds=4).hash(user_info[Labels.Password])
		user_info[Labels.Email] = user_info[Labels.Email].lower()
		user_info[Labels.TimeStamp] =  time.time()
		user_info[Labels.EmailConfirmed] = False
		user_info[Labels.EmailConfirmationId] = is_valid_submission[Lagels.EmailConfirmationId]
		self.insertDictToTable(user_info)
		return {Labels.Success : True}

	# this is a WIP and will be updated to handle the correct user information
	def isUserSubmissionValid(self, user_info):
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
		output[Labels.Succss] = False
		user_info = self.getUserInfoFromEmail(login_info[Labels.Email])
		if user_info == None:
			output[Labels.Error] = "Email does not exist"
			return output
		password_matches = argon2.verify(login_info[Labels.Password], user_info[Labels.Password])
		if not password_matches:
			output[Labels.Error] = "Password does not match provided email"
			return output
		return {Labels.Success : True, Labels.UserInfo : user_info}

	# gets the user info from email
	# returns a dictionary of the row that matches the email given
	def getUserInfoFromEmail(self, email):
		return self.getRowByUniqueProperty(Labels.Email, email)

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
	# I understand the 'email' magic string, still thinking the best way to handle it right now
	# how to make a Labels like class for all the db management
	def isEmailConfirmed(self, email):
		user_info = self.getUserInfoFromEmail(login_info[Labels.Email])
		if user_info == None:
			return None
		return user_info[Labels.EmailConfirmed]

	# sets the 'email_confirmed' column to true for this e-mail
	def confirmEmail(self, email_confirmation_id):
		self.updateEntryByKey(Labels.EmailConfirmationId, email_confirmation_id, Labels.EmailConfirmed, True)
		return {Labels.Success : True}
