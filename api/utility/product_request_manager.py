import time
import string
import random
import time
import psycopg2
import base64
from api.utility import email_api
from api.utility.sql_manager import SqlManager
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables

class Labels:
	SubmissionId = "submission_id"
	TimeStamp = "time_stamp"
	ProductDescription = "product_description"
	Name = "name"
	Email = "email"
	PhoneNumber = "phone_number"
	Completed = "completed"
	Confirmed = "confirmed"
	ConfirmationId = "confirmation_id"
	SoftDeleted = "soft_deleted"
	PriceRange = "price_range"
	PhoneNumber = "phone_number"
	Success = "success"
	Error = "error"

product_request_database_columns = [
								{"name" :  Labels.SubmissionId, "type" : "TEXT"},
								{"name" :  Labels.TimeStamp, "type" : "FLOAT"},
								{"name" :  Labels.Name, "type" : "TEXT"},
								{"name" :  Labels.ProductDescription, "type" : "TEXT"},
								{"name" :  Labels.PriceRange, "type" : "TEXT"},
								{"name" :  Labels.Email, "type" : "TEXT"},
								{"name" :  Labels.PhoneNumber, "type" : "TEXT"},
								{"name" :  Labels.Completed, "type" : "BOOL"},
								{"name" :  Labels.Confirmed, "type" : "BOOL"},
								{"name" :  Labels.ConfirmationId, "type" : "TEXT"},
								{"name" :  Labels.SoftDeleted, "type" : "BOOL"},
								]

product_request_submission_variables = [
									Labels.Name,
									Labels.ProductDescription,
									Labels.PriceRange,
									Labels.Email,
									Labels.PhoneNumber,
									]

						 
class ProductRequestManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.UserRequestTable or table_name == TestTables.UserRequestTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createProductRequestTable()

	# initializes the product request table
	def createProductRequestTable(self):
		self.createTableIfNotExists(product_request_database_columns)
		self.addIndexIfNotExists(Labels.SubmissionId)

	# checks if the given table has the image id
	def isSubmissionIdTaken(self, submission_id):
		return self.tableHasEntryWithProperty(Labels.SubmissionId, submission_id)
	
	# generates a new submission_id for the given table
	def generateNewSubmissionId(self):
		return self.generateUniqueIdForColumn(Labels.SubmissionId)

	def isConfirmationIdTaken(self, confirmation_id):
		return self.tableHasEntryWithProperty(Labels.ConfirmationId, confirmation_id)

	def generateNewConfirmationId(self):
		return self.generateUniqueIdForColumn(Labels.ConfirmationId)

	# returns a dictionary with all request submissions, not including the soft_deleted ones
	def getProductRequests(self):
		allRequests = self.tableToDict()
		actualRequests = list()
		for request in allRequests:
			if not request[Labels.SoftDeleted]:
				actualRequests.append(request)
		return actualRequests

	# adds a product request to the database
	def addProductRequest(self, request, send_email = True):
		if request.get(Labels.Email) != None:
			request[Labels.Email] = request[Labels.Email].lower()
		submitted_keys = product_request_submission_variables
		
		confirmation_id = self.generateNewConfirmationId()
		# send the user an email asking to confirm the request
		try: 
			email_api.sendRequestConfirmation(request, confirmation_id)
		# otherwise there's an error in the email
		except:
			return {Labels.Success : False, Labels.Error : "This email is not valid"}
		## add code to send us an email when this happens 
		if send_email:
			email_api.sendRequestEmail(request)
		submission_id = self.generateNewSubmissionId()
		request[Labels.TimeStamp] = time.time()
		request[Labels.Confirmed] = False
		request[Labels.Completed] = False
		request[Labels.ConfirmationId] = confirmation_id
		request[Labels.SoftDeleted] = False
		self.insertDictIntoTable(request)
		return {Labels.Success : True, Labels.Error : submission_id}

	# given a submission_id, we find the request as a dict from the database
	def getProductRequestBySubmissionId(self, submission_id):
		if submission_id == None:
			return None
		this_submission = self.getRowByUniqueProperty(Labels.SubmissionId, submission_id)
		return this_submission

	# confirms a product request
	def confirmProductRequest(self, confirmation_id):
		if confirmation_id == None:
			output[Labels.Success] = False
			output[Labels.Error] = "Confirmation id is None"
			return output
		if len(confirmation_id) != 20:
			output[Labels.Success] = False
			output[Labels.Error] = "Confirmation id is not right length"
			return output
		self.updateRowsByProperty(Labels.ConfirmationId, confirmation_id, Labels.Confirmed, True)
		return {Labels.Success : True}

	## deletes a product request by id
	def deleteProductRequestBySubmissionId(self, submission_id):
		self.deleteRowsFromTableByProperty(Labels.SubmissionId, submission_id)

	def softDeleteProductRequestBySubmissionId(self, submission_id):
		self.updateRowsByProperty(Labels.SubmissionId, submission_id, Labels.SoftDeleted, True)




