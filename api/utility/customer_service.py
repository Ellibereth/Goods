import time
import string
import random
import psycopg2
from api.utility import email_api
from api.utility.sql_manager import SqlManager
from passlib.hash import argon2
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables

# MIN_PASSWORD_LENGTH = 6
customer_service_request_columns = [
						{"name" : "request_id", "type" : "TEXT"},
						{"name" : "time_stamp", "type" : "FLOAT"},
						{"name" : "account_id", "type" : "TEXT"},
						{"name" : "subject", "type" : "TEXT"},
						{"name" : "body", "type" : "TEXT"},
						{"name" : "date_resolved", "type" : "FLOAT"},
						{"name" : "rating", "type" : "TEXT"},
						{"name" : "email", "type" : "TEXT"},
					]

customer_service_message_columns = [
						{"name" : "request_id", "type" : "TEXT"},
						{"name" : "time_stamp", "type" : "FLOAT"},
						{"name" : "account_id", "type" : "TEXT"},
						{"name" : "subject", "type" : "TEXT"},
						{"name" : "body", "type" : "TEXT"},
						{"name" : "date_resolved", "type" : "FLOAT"},
						{"name" : "rating", "type" : "TEXT"},
						{"name" : "email", "type" : "TEXT"},
					]

class Labels:
	Email = "email"
	TimeStamp = "time_stamp"
	AccountId = "account_id"
	Success = "success"
	Error = "error"
	RequestId = "request_id"
	DateResolved = "date_resolved"
	Rating = "rating"
	Subject = "subject"


## class to handle sql entires to manage replies to customer service requests
## each request will have a message thread along with it
class CustomerServiceMessage(SqlManager):
	def __init__(self, test = False):
		if test:
			self.table_name = TestTables.CustomerServiceReplyTable
		else:
			self.table_name = ProdTables.CustomerServiceReplyTable
		SqlManager.__init__(self, self.table_name)

	def createCustomerMessageTable(self):
		self.createNewTableIfNotExists()
		for col in customer_service_message_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])


## stores and manages the customer service requests
## think of a ticket for IT
class CustomerServiceRequest(SqlManager):
	def __init__(self, test = False):
		if test:
			self.table_name = TestTables.CustomerServiceTable
		else:
			self.table_name = ProdTables.CustomerServiceTable
		SqlManager.__init__(self, self.table_name)

	# initializes a user info table 
	def createCustomerServiceTable(self):
		self.createNewTableIfNotExists()
		for col in customer_service_request_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# returns a new request id
	def generateRequestId(self):
		return self.generateUniqueId(Labels.RequestId)

	# given a request with the above columns, we add it to the database
	def addCutomerServiceRequestToTable(self, request):
		if request == None:
			return
		request[Labels.TimeStamp] = time.time()
		request[Labesl.RequestId] = self.generateRequestId()
		self.insertDictIntoTable(request)

	# resolves a customer request right now
	def resolveCustomerServiceRequest(self, request_id):
		now = time.time()
		self.updateEntryByKey(Labels.RequestId, request_id, Labels.DateResolved, now)

	# returns the entire request informatio by the request id
	def getCustomerServiceRequestById(self, request_id):
		return self.getRowByUniqueProperty(Labels.RequestId, request_id)

	# returns all requests that are not resolved
	# make sure you test this so SQL knows what to do with it
	def getUnresolvedRequests(self):
		return self.getRowsByKey(Lables.DateResolved, None)


class CustomerServiceManager:
	def __init__(self):
		self.name = "Customer Service Manager"



