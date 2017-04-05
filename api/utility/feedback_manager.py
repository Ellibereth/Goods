import time
import string
import random
import psycopg2
import base64
from api.utility import email_api
from api.utility.sql_manager import SqlManager
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables


class Labels:
	FeedbackId = "f_id"
	TimeStamp = "time_stamp"
	Email = "email"
	Feedback = "feedback"
	Name = "name"
	Success = "success"

feedback_table_columns = [
						{"name" : Labels.FeedbackId, "type" : "TEXT"},
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.Email,		"type" : "TEXT"},
						{"name" : Labels.Feedback, "type" : "TEXT"},
						{"name" : Labels.Name, "type": "TEXT"}
					]

feedback_inputs = [Labels.Email, Labels.Name, Labels.Feedback]

class FeedbackManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.FeedbackTable or table_name == TestTables.FeedbackTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createFeedbackTable()

	def createFeedbackTable(self):
		self.createTableIfNotExists(feedback_table_columns)
		self.addIndexIfNotExists(Labels.FeedbackId)

	# generates a new email_confirmation_id
	def generateFeedbackId(self):
		return self.generateUniqueIdForColumn(Labels.FeedbackId)

	def tableHasFeedbackId(self, f_id):
		return self.tableHasEntryWithProperty(Labels.FeedbackId, f_id)

	## adds feedback
	def addFeedback(self, feedback):
		feedback[Labels.TimeStamp] = time.time()
		feedback[Labels.FeedbackId] = self.generateFeedbackId()
		# we use this to confirm that the email the user submitted is valid
		try:
			email_api.sendFeedbackEmailNotification(feedback)
		except:
			output = {}
			output[Labels.Success] = True
			output[Labels.Error] = "User submitted bad email address"
			return output
		self.insertDictIntoTable(feedback)
		return {Labels.Success : True}





