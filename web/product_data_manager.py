import time
import datetime
import string
import random
import os
import sys
import time
import psycopg2
import urllib
import base64
import email_api
from credentials import credential
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
								'completed'
								]
product_request_submission_variables = [
									'name',
									'product_description',
									'price_range',
									'email',
									'phone_number',
									]

# merge sorts an output from tableToDict by time_stamp
def mergeSort(x):
	result = []
	if len(x) < 2:
		return x
	mid = int(len(x)/2)
	y = mergeSort(x[:mid])
	z = mergeSort(x[mid:])
	while (len(y) > 0) or (len(z) > 0):
		if len(y) > 0 and len(z) > 0:
			# this is in case the time stamp is blank
			if y[0]['time_stamp'] == None:
				y_time_stamp = 0
			else:
				y_time_stamp = y[0]['time_stamp']
			if z[0]['time_stamp'] == None:
				z_time_stamp = 0
			else:
				z_time_stamp = z[0]['time_stamp']
			if y_time_stamp > z_time_stamp:
				result.append(z[0])
				z.pop(0)
			else:
				result.append(y[0])
				y.pop(0)
		elif len(z) > 0:
			for i in z:
				result.append(i)
				z.pop(0)
		else:
			for i in y:
				result.append(i)
				y.pop(0)
	return result
						 
class ProductDataManager:
	def __init__(self):
		self.USER_SUBMISSION_TABLE = "USER_SUBMISSION_TABLE"
		self.USER_REQUEST_TABLE = "USER_REQUEST_TABLE"
		self.sql = SqlManager()
		# database_credentials = credential.getDatabaseCredentials()
		# self.p_db = psycopg2.connect(
		#     database=database_credentials['database'],
		#     user= database_credentials['user'],
		#     password= database_credentials['password'],
		#     host=database_credentials['host'],
		#     port=database_credentials['port']
		# )
		# self.p_db.autocommit = True
		# self.db = self.p_db.cursor()

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
	def isUniqueIdTaken(self, table_name, submission_id):
		column_name = "submission_id"
		return self.sql.tableHasEntryWithProperty(table_name, column_name, submission_id)
	
	# generates a new submission_id for the given table
	def generateNewUniqueId(self, table_name):
		submission_id = self.id_generator()
		while self.isUniqueIdTaken(submission_id, table_name):
			submission_id = self.id_generator()
		return submission_id

	# returns a dictionary with all product submission
	def getProductSubmissions(self):
		allProducts = self.sql.tableToDict(self.USER_SUBMISSION_TABLE)
		return mergeSort(allProducts)

	# returns a dictionary with all request submissions
	def getProductRequests(self):
		allRequests = self.sql.tableToDict(self.USER_REQUEST_TABLE)
		return mergeSort(allRequests)
	
	# verifies a product submission by submission_id
	def verifyProductSubmission(self, submission_id):
		if submission_id == None or submission_id == "":
			return
		# if the unique id is not in use, then return 
		elif not self.isUniqueIdTaken(submission_id):
			return
		else:
			table_name = self.USER_SUBMISSION_TABLE
			column_name = "verified"
			data = True
			self.sql.updateEntryByKey(table_name, 'submission_id', submission_id, column_name, data)

	# adds a product request to the database
	def addProductRequest(self, request, send_email = None):
		if send_email == None:
			send_email = True
		keys = product_request_submission_variables
		self.createProductRequestTable()
		table_name = self.USER_REQUEST_TABLE
		submission_id = self.generateNewUniqueId(table_name)
		time_stamp = time.time()
		self.sql.insertIntoTableWithInitialValue(table_name, "submission_id", submission_id)
		## update the timestamp
		self.sql.updateEntryByKey(table_name, 'submission_id', submission_id, "time_stamp", time_stamp)
		## add code to send us an email when this happens 
		if send_email:
			email_api.sendRequestEmail(request)
		for key in keys:
			if key != "submission_id":
				self.sql.updateEntryByKey(table_name, "submission_id", submission_id, key, request.get(key))
		return submission_id

	# given a submission_id, we find the request as a dict from the database
	def getProductRequestBySubmissionId(self, submission_id):
		if submission_id == None:
			return None
		table_name = self.USER_REQUEST_TABLE
		this_submission = self.sql.getRowByUniqueProperty(table_name, 'submission_id', submission_id)
		return this_submission

	# takes submission dictionary as input then writes it to the database
	# also sends the image as an email to darek@manaweb.com
	# this should be refactored, but I'm not sure how to rework it best at this time
	# looking for comments and suggestions
	# Darek Johnson 3/11
	def addProductSubmission(self, submission):
		self.createProductSubmissionTable()
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
		submission_id = self.generateNewUniqueId(table_name)
		sql = self.db.mogrify("INSERT INTO " + table_name + " (submission_id, time_stamp) VALUES (%s, %s)"
					,(submission_id, time_stamp))
		self.db.execute(sql)
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

if __name__ == '__main__':
	product_data_manager = ProductDataManager()
	data = product_data_manager.getRequestSubmissions()
	print(data)
	product_data_manager.closeConnection()

