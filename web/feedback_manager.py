import time
import string
import random
import psycopg2
import base64
import email_api
from sql_manager import SqlManager
					

feedback_table_columns = [
						{"name" : "f_id", "type" : "TEXT"},
						{"name" : "time_stamp", "type" : "FLOAT"},
						{"name" : "email",		"type" : "TEXT"},
						{"name" : "feedback", "type" : "TEXT"},
						{"name" : "name", "type": "TEXT"}
					]

feedback_inputs = ['email', 'name', 'feedback']

class FeedbackManager:
	def __init__(self):
		self.FEEDBACK_TABLE = "FEEDBACK_TABLE"
		self.sql = SqlManager(self.FEEDBACK_TABLE)
		self.createFeedbackTable()
		
	# closes the conncetion to the postgre sql database
	def closeConnection(self):
		self.sql.closeConnection()

	# initializes a feedback table 
	def createFeedbackTable(self):
		self.sql.createNewTableIfNotExists()
		for col in feedback_table_columns:
			self.sql.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# generates a new email_confirmation_id
	def generateFeedbackId(self):
		new_f_id = self.sql.id_generator()
		while self.tableHasFeedbackId(new_f_id):
			new_f_id = self.sql.id_generator()
		return new_f_id

	def tableHasFeedbackId(self, f_id):
		column_name = "f_id"
		entry_data = f_id
		return self.sql.tableHasEntryWithProperty(column_name, entry_data)


	## adds feedback
	def addFeedback(self, feedback):
		output = {}
		time_stamp = time.time()
		f_id = self.generateFeedbackId()
		self.sql.addColumnToTableIfNotExists('email')
		self.sql.insertIntoTableWithInitialValue('f_id', f_id)
		feedback['time_stamp'] = time_stamp
		feedback['f_id'] = f_id
		email_api.sendFeedbackEmailNotification(feedback)
		for col in feedback_table_columns:
			key = col['name']
			self.sql.addColumnToTableIfNotExists(col['name'], col['type'])
			self.sql.updateEntryByKey('f_id', f_id, key, feedback[key])
		output['success'] = True
		return output





