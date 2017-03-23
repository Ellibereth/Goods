import time
import string
import random
import psycopg2
import base64
import api.utility.email_api
from api.utility.sql_manager import SqlManager
from api.utility import validation
from passlib.hash import argon2

user_info_columns = [
						{"name" : "time_stamp", "type" : "FLOAT"},
						{"name" : "email",		"type" : "TEXT"},
						{"name" : "email_confirmation_id", "type" : "TEXT"},
						{"name" : "email_confirmed", "type": "BOOL"},
						{"name" : "username", "type" : "TEXT"},
						{"name" : "password", "type" : "TEXT"}
					]

class AccountManager(SqlManager):
	def __init__(self):
		self.USER_INFO_TABLE= "USER_INFO_TABLE"
		SqlManager.__init__(self, self.USER_INFO_TABLE)

	# initializes a user info table 
	def createUserInfoTable(self):
		self.createNewTableIfNotExists()
		for col in user_info_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# handles a new user email
	# first checks if the email is in the table
	# also checks if it's a real email too with a try/except in email_api.py
	# user_info is a dictioary right now
	def addUser(self, user_info):
		self.createNewTableIfNotExists()
		is_valid_submission = self.isUserSubmissionValid(user_info)
		if not valid_submission['success']:
			return is_valid_submission

		output = {}
		# we hard code the email and username to lower case
		user_info['password'] = argon2.using(rounds=4).hash(user_info['password'])
		user_info['username'] = user_info['username'].lower()
		user_info['email'] = user_info['email'].lower()
		user_info['time_stamp'] = time_stamp = time.time()
		user_info['email_confirmed'] = False
		user_info['email_confirmation_id'] = email_confirmation_id
		self.insertDictToTable(user_info)
		output['success'] = True
		return output

	# this is a WIP and will be updated to handle the correct user information
	def isUserCreationValid(self, user_info):
		output ={}
		email = user_info.
		try:
			email = input_email.lower()
		except:
			output['success'] = False
			output['error'] = "Email is not a string"
			return output
		email_confirmation_id = self.generateEmailConfirmationId()
		if self.tableHasEmail(email):
			output['success'] = False
			output['error'] = "No need to send an confirmation since this email exists!"
			return output
		try:
			email_api.sendEmailConfirmation(email, email_confirmation_id)
		except:
			output['success'] = False
			output['error'] = "Invalid Email Address"
			return output
		output['success'] = True

	# generates a new email_confirmation_id
	def generateEmailConfirmationId(self):
		column_name = "email_confirmation_id"
		return self.generateUniqueId(column_name)
		
	def tableHasConfirmationId(self, email_confirmation_id):
		column_name = "email_confirmation_id"
		entry_data = email_confirmation_id
		return self.tableHasEntryWithProperty(column_name, entry_data)

	# returns true if the email is in the table
	def tableHasEmail(self, email):
		column_name = "email"
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
			if row['email'] == email.lower():
				if row['email_confirmed'] == True:
					is_confirmed = True
					break
		return is_confirmed

	# sets the 'email_confirmed' column to true for this e-mail
	def confirmEmail(self, email_confirmation_id):
		key_column_name = "email_confirmation_id"
		key = email_confirmation_id
		target_column_name = "email_confirmed"
		data = True
		self.updateEntryByKey(key_column_name, key, target_column_name, data)
		output = {}
		output['success'] = True
		return output
