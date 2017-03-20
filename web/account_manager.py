import time
import string
import random
import psycopg2
import base64
import email_api
from sql_manager import SqlManager
					

user_info_columns = [
						{"name" : "time_stamp", "type" : "FLOAT"},
						{"name" : "email",		"type" : "TEXT"},
						{"name" : "email_confirmation_id", "type" : "TEXT"},
						{"name" : "email_confirmed", "type": "BOOL"}
					]

class AccountManager:
	def __init__(self):
		self.USER_INFO_TABLE= "USER_INFO_TABLE"
		self.sql = SqlManager(self.USER_INFO_TABLE)
		
	# closes the conncetion to the postgre sql database
	def closeConnection(self):
		self.sql.closeConnection()

	# initializes a user info table 
	def createUserInfoTable(self):
		self.sql.createNewTableIfNotExists()
		for col in user_info_columns:
			self.sql.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# handles a new user email
	# first checks if the email is in the table
	# also checks if it's a real email too with a try/except in email_api.py
	def addEmailToUserInfoTable(self, input_email):
		self.sql.createNewTableIfNotExists()
		output = {}
		try:
			email = input_email.lower()
		except:
			output['success'] = False
			output['error'] = "Email is not a string"
			return output
		email_confirmation_id = self.generateEmailConfirmationId()
		print(self.tableHasEmail(email))
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
		time_stamp = time.time()
		self.sql.addColumnToTableIfNotExists('email')
		self.sql.insertIntoTableWithInitialValue('email', email)
		default_info = {}
		default_info['time_stamp'] = time_stamp
		default_info['email_confirmed'] = False
		default_info['email_confirmation_id'] = email_confirmation_id
		default_info['email'] = email
		for col in user_info_columns:
			key = col['name']
			self.sql.addColumnToTableIfNotExists(col['name'], col['type'])
			self.sql.updateEntryByKey('email', email, key, default_info[key])
		output['success'] = True
		return output

	# generates a new email_confirmation_id
	def generateEmailConfirmationId(self):
		new_email_id = self.sql.id_generator()
		while self.tableHasConfirmationId(new_email_id):
			new_email_id = self.sql.id_generator()
		return new_email_id

	def tableHasConfirmationId(self, email_confirmation_id):
		column_name = "email_confirmation_id"
		entry_data = email_confirmation_id
		return self.sql.tableHasEntryWithProperty(column_name, entry_data)


	# returns true if the email is in the table
	def tableHasEmail(self, email):
		column_name = "email"
		entry_data = email
		return self.sql.tableHasEntryWithProperty(column_name, entry_data)

	# returns true if the email is confirmed
	# returns false if the email is not confirmed or does not exists
	# I understand the 'email' magic string, still thinking the best way to handle it right now
	# how to make a Labels like class for all the db management
	def isEmailConfirmed(self, email):
		table_data = self.sql.tableToDict()
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
		self.sql.updateEntryByKey(key_column_name, key, target_column_name, data)
		output = {}
		output['success'] = True
		return output
