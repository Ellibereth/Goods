import time
import string
import random
import psycopg2
import base64
from api.utility import email_api
from api.utility.sql_manager import SqlManager
					

feedback_table_columns = [
						{"name" : "f_id", "type" : "TEXT"},
						{"name" : "time_stamp", "type" : "FLOAT"},
						{"name" : "email",		"type" : "TEXT"},
						{"name" : "feedback", "type" : "TEXT"},
						{"name" : "name", "type": "TEXT"}
					]

feedback_inputs = ['email', 'name', 'feedback']

class FeedbackManager(SqlManager):
	def __init__(self):
		self.FEEDBACK_TABLE = "FEEDBACK_TABLE"
		SqlManager.__init__(self, self.FEEDBACK_TABLE)
		self.createFeedbackTable()

	# initializes a feedback table 
	def createFeedbackTable(self):
		self.createNewTableIfNotExists()
		for col in feedback_table_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# generates a new email_confirmation_id
	def generateFeedbackId(self):
		return self.generateUniqueIdForColumn('f_id')

	def tableHasFeedbackId(self, f_id):
		column_name = "f_id"
		entry_data = f_id
		return self.tableHasEntryWithProperty(column_name, entry_data)

	## adds feedback
	def addFeedback(self, feedback):
		output = {}
		time_stamp = time.time()
		f_id = self.generateFeedbackId()
		self.addColumnToTableIfNotExists('email')
		self.insertIntoTableWithInitialValue('f_id', f_id)
		feedback['time_stamp'] = time_stamp
		feedback['f_id'] = f_id
		email_api.sendFeedbackEmailNotification(feedback)
		for col in feedback_table_columns:
			key = col['name']
			self.addColumnToTableIfNotExists(col['name'], col['type'])
			self.updateEntryByKey('f_id', f_id, key, feedback[key])
		output['success'] = True
		return output





