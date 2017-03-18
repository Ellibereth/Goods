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
product_submission_database_columns = [
							'submission_id', 
							'image_id',
							'time_stamp',
							'manufacturer_name',
							'url_link',
							'contact_information',
							'product_name',
							'origin',
							'barcode_upc',
							'barcode_type',
							'additional_info',
							'verified',
							'num_images'
						 ]

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

						 
class ProductDataManager:
	def __init__(self):
		self.USER_SUBMISSION_TABLE = "USER_SUBMISSION_TABLE"
		self.USER_REQUEST_TABLE = "USER_REQUEST_TABLE"
		self.sql = SqlManager()
		self.createProductSubmissionTable()
		self.createProductRequestTable()

	def closeConnection(self):
		self.sql.closeConnection()	

	# initializes the product submission table
	def createProductSubmissionTable(self):
		self.sql.createNewTableIfNotExists(self.USER_SUBMISSION_TABLE)

	# initializes the product request table
	def createProductRequestTable(self):
		self.sql.createNewTableIfNotExists(self.USER_REQUEST_TABLE)

	# returns a random alphanumric character with size 20
	# used for generating submission_id
	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	# checks if the given table has the image id
	def isImageIdTaken(self, table_name, image_id):
		column_name = "image_id"
		return self.sql.tableHasEntryWithProperty(table_name, column_name, image_id)

	# generates new image id for the given table
	def generateNewImageId(self, table_name):
		image_id = self.id_generator()
		while self.isImageIdTaken(table_name, image_id):
			image_id = self.id_generator()
		return image_id

	# checks if the given table has the image id
	def isSubmissionIdTaken(self, table_name, submission_id):
		column_name = "submission_id"
		return self.sql.tableHasEntryWithProperty(table_name, column_name, submission_id)
	
	# generates a new submission_id for the given table
	def generateNewSubmissionId(self, table_name):
		submission_id = self.id_generator()
		while self.isSubmissionIdTaken(table_name, submission_id):
			submission_id = self.id_generator()
		return submission_id

	def isConfirmationIdTaken(self, table_name, confirmation_id):
		column_name = "confirmation_id"
		return self.sql.tableHasEntryWithProperty(table_name, column_name, confirmation_id)

	def generateNewConfirmationId(self, table_name):
		confirmation_id = self.id_generator()
		while self.isConfirmationIdTaken(confirmation_id, table_name):
			confirmation_id = self.id_generator()
		return confirmation_id

	# returns a dictionary with all product submission
	def getProductSubmissions(self):
		allProducts = self.sql.tableToDict(self.USER_SUBMISSION_TABLE)
		return allProducts

	# returns a dictionary with all request submissions, not including the soft_deleted ones
	def getProductRequests(self):
		allRequests = self.sql.tableToDict(self.USER_REQUEST_TABLE)
		actualRequests = list()
		for request in allRequests:
			if not request['soft_deleted']:
				actualRequests.append(request)
		return actualRequests
	
	# verifies a product submission by submission_id
	def verifyProductSubmission(self, submission_id):
		if submission_id == None or submission_id == "":
			return
		# if the submission id is not in use, then return 
		elif not self.isSubmissionIdTaken(submission_id):
			return
		else:
			table_name = self.USER_SUBMISSION_TABLE
			column_name = "verified"
			data = True
			self.sql.updateEntryByKey(table_name, 'submission_id', submission_id, column_name, data)

	# adds a product request to the database
	def addProductRequest(self, request, send_email = True):
		if request.get('email') != None:
			request['email'] = request['email'].lower()
		output = {}
		submitted_keys = product_request_submission_variables
		table_name = self.USER_REQUEST_TABLE
		submission_id = self.generateNewSubmissionId(table_name)
		confirmation_id = self.generateNewConfirmationId(table_name)
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
		self.sql.insertIntoTableWithInitialValue(table_name, "submission_id", submission_id)
		## update the other variables
		self.sql.updateEntryByKey(table_name, "submission_id", submission_id, 'time_stamp', time_stamp)
		self.sql.updateEntryByKey(table_name, "submission_id", submission_id, 'confirmed', False)
		self.sql.updateEntryByKey(table_name, "submission_id", submission_id, 'completed', False)
		self.sql.updateEntryByKey(table_name, "submission_id", submission_id, 'confirmation_id', confirmation_id)
		self.sql.updateEntryByKey(table_name, 'submission_id', submission_id, 'soft_deleted', False)
		for key in submitted_keys:
			if key != "submission_id":
				self.sql.updateEntryByKey(table_name, "submission_id", submission_id, key, request.get(key))
		output['success'] = True
		output['submission_id'] = submission_id
		return output

	# given a submission_id, we find the request as a dict from the database
	def getProductRequestBySubmissionId(self, submission_id):
		if submission_id == None:
			return None
		table_name = self.USER_REQUEST_TABLE
		this_submission = self.sql.getRowByUniqueProperty(table_name, 'submission_id', submission_id)
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

		table_name = self.USER_REQUEST_TABLE
		key_column_name = "confirmation_id"
		key = confirmation_id
		target_column_name = "confirmed"
		data = True
		self.sql.updateEntryByKey(table_name, key_column_name, key, target_column_name, data)
		output = {}
		output['success'] = True
		return output

	# takes submission dictionary as input then writes it to the database
	# also sends the image as an email to darek@manaweb.com
	# this should be refactored, but I'm not sure how to rework it best at this time
	# looking for comments and suggestions
	# Darek Johnson 3/11
	def addProductSubmission(self, submission):
		table_name = self.USER_SUBMISSION_TABLE
		# write the image_id and store the data
		image_data = submission.get('images')
		if image_data != None:
			num_images = len(image_data)
			submission['num_images'] = num_images
			image_id = self.generateNewImageId(table_name)
			count = 0
			for image in image_data:
				# write the image file to memory as a png, if there is image data
				if image != None and image != "":
					image_bytes = image.encode('utf-8')
					image_decoded = base64.decodestring(image_bytes)
					image_name = image_id + "_" + str(count) + ".png"
					with open("./web/static/images/product_submissions/" + image_name, "wb") as fh:
						fh.write(image_decoded)
					submission['image_id'] = image_id
					email_api.sendImageEmail(image_name, image_decoded)
				count = count + 1
		else:
			num_images = 0
		submission['verified'] = False
		submission['num_images'] = num_images
		for key in submission:
			if submission.get(key) == None:
				submission[key] = ""

		## insert into the database
		time_stamp = time.time()
		submission_id = self.generateNewSubmissionId(table_name)
		self.sql.insertIntoTableWithInitialValue(table_name, "submission_id", submission_id)
		## update the other variables
		self.sql.updateEntryByKey(table_name, "submission_id", submission_id, 'time_stamp', time_stamp)
		self.sql.updateEntryByKey(table_name, "submission_id", submission_id, 'confirmed', False)
		for key in product_request_submission_variables:
			if submission.get(key) != None:
				self.sql.updateEntryByKey(table_name, 'submission_id', submission_id, key, submission[key])

	## deletes a product submission by id
	def deleteProductSubmissionById(self, submission_id):
		table_name = self.USER_SUBMISSION_TABLE
		column_name = "submission_id"
		self.sql.deleteRowFromTableByProperty(table_name, column_name, submission_id)

	## deletes a product request by id
	def deleteProductRequestBySubmissionId(self, submission_id):
		table_name = self.USER_REQUEST_TABLE
		column_name = "submission_id"
		self.sql.deleteRowFromTableByProperty(table_name, column_name, submission_id)

	def softDeleteProductRequestBySubmissionId(self, submission_id):
		table_name = self.USER_REQUEST_TABLE
		column_name = "submission_id"
		key = "soft_deleted"
		value = True
		self.sql.updateEntryByKey(table_name, column_name, submission_id, key, value)
		output = {}
		output['success'] = True
		return output


if __name__ == '__main__':
	product_data_manager = ProductDataManager()
	data = product_data_manager.getProductRequests()
	for item in data:
		print(item['submission_id'])
	product_data_manager.closeConnection()

