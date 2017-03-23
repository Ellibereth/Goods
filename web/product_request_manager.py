import time
import string
import random
import time
import psycopg2
import base64
import email_api
from sql_manager import SqlManager

## this is the same as the submission variables in product_data_manager.py 
## should I just put these in a CSV?
product_request_database_columns = [
								'submission_id',
								'time_stamp',
								'name',
								'product_description',
								'price_range',
								'email',
								'phone_number',
								'completed',
								'confirmed',
								'confirmation_id',
								'soft_deleted'
								]

product_request_submission_variables = [
									'name',
									'product_description',
									'price_range',
									'email',
									'phone_number',
									]

						 
class ProductRequestManager(SqlManager):
	def __init__(self):
		self.USER_REQUEST_TABLE = "USER_REQUEST_TABLE"
		SqlManager.__init__(self, self.USER_REQUEST_TABLE)
		self.createProductRequestTable()

	# initializes the product request table
	def createProductRequestTable(self):
		self.createNewTableIfNotExists()

	# returns a random alphanumric character with size 20
	# used for generating submission_id
	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	# checks if the given table has the image id
	def isImageIdTaken(self, image_id):
		column_name = "image_id"
		return self.tableHasEntryWithProperty(column_name, image_id)

	# generates new image id for the given table
	def generateNewImageId(self):
		image_id = self.id_generator()
		while self.isImageIdTaken(image_id):
			image_id = self.id_generator()
		return image_id

	# checks if the given table has the image id
	def isSubmissionIdTaken(self, submission_id):
		column_name = "submission_id"
		return self.tableHasEntryWithProperty(column_name, submission_id)
	
	# generates a new submission_id for the given table
	def generateNewSubmissionId(self):
		submission_id = self.id_generator()
		while self.isSubmissionIdTaken(submission_id):
			submission_id = self.id_generator()
		return submission_id

	def isConfirmationIdTaken(self, confirmation_id):
		column_name = "confirmation_id"
		return self.tableHasEntryWithProperty(column_name, confirmation_id)

	def generateNewConfirmationId(self):
		confirmation_id = self.id_generator()
		while self.isConfirmationIdTaken(confirmation_id):
			confirmation_id = self.id_generator()
		return confirmation_id

	# returns a dictionary with all request submissions, not including the soft_deleted ones
	def getProductRequests(self):
		allRequests = self.tableToDict()
		actualRequests = list()
		for request in allRequests:
			if not request['soft_deleted']:
				actualRequests.append(request)
		return actualRequests

	# adds a product request to the database
	def addProductRequest(self, request, send_email = True):
		if request.get('email') != None:
			request['email'] = request['email'].lower()
		output = {}
		submitted_keys = product_request_submission_variables
		submission_id = self.generateNewSubmissionId()
		confirmation_id = self.generateNewConfirmationId()
		time_stamp = time.time()
		# send the user an email asking to confirm the request
		try: 
			email_api.sendRequestConfirmation(request, confirmation_id)
		# otherwise there's an error in the email
		except:
			output['success'] = False
			output['error'] = "This email is not valid"
			return output
		## add code to send us an email when this happens 
		if send_email:
			email_api.sendRequestEmail(request)
		# initializes with the submission_id
		self.insertIntoTableWithInitialValue("submission_id", submission_id)
		## update the other variables
		self.updateEntryByKey("submission_id", submission_id, 'time_stamp', time_stamp)
		self.updateEntryByKey("submission_id", submission_id, 'confirmed', False)
		self.updateEntryByKey("submission_id", submission_id, 'completed', False)
		self.updateEntryByKey("submission_id", submission_id, 'confirmation_id', confirmation_id)
		self.updateEntryByKey('submission_id', submission_id, 'soft_deleted', False)
		for key in submitted_keys:
			if key != "submission_id":
				self.updateEntryByKey("submission_id", submission_id, key, request.get(key))
		output['success'] = True
		output['submission_id'] = submission_id
		return output

	# given a submission_id, we find the request as a dict from the database
	def getProductRequestBySubmissionId(self, submission_id):
		if submission_id == None:
			return None
		this_submission = self.getRowByUniqueProperty('submission_id', submission_id)
		return this_submission

	def confirmProductRequest(self, confirmation_id):
		if confirmation_id == None:
			output['success'] = False
			output['error'] = "Confirmation id is None"
			return output
		if len(confirmation_id) != 20:
			output['success'] = False
			output['error'] = "Confirmation id is not right length"
			return output
		key_column_name = "confirmation_id"
		key = confirmation_id
		target_column_name = "confirmed"
		data = True
		self.updateEntryByKey(key_column_name, key, target_column_name, data)
		output = {}
		output['success'] = True
		return output

	## deletes a product request by id
	def deleteProductRequestBySubmissionId(self, submission_id):
		column_name = "submission_id"
		self.deleteRowFromTableByProperty(column_name, submission_id)

	def softDeleteProductRequestBySubmissionId(self, submission_id):
		column_name = "submission_id"
		key = "soft_deleted"
		value = True
		self.updateEntryByKey(column_name, submission_id, key, value)
		output = {}
		output['success'] = True
		return output


if __name__ == '__main__':
	product_data_manager = ProductDataManager()
	data = product_data_manager.getProductRequests()
	for item in data:
		print(item['submission_id'])
	product_data_manager.closeConnection()

