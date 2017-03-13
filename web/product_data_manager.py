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

sys.path.append('./credentials')
import credential

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
								'product_description',
								'price_min',
								'price_max',
								'contact_information'
								]
						 
class ProductDataManager:
	def __init__(self):
		self.USER_SUBMISSION_TABLE = "USER_SUBMISSION_TABLE"
		self.USER_REQUEST_TABLE = "USER_REQUEST_TABLE"
		database_credentials = credential.getDatabaseCredentials()
		self.p_db = psycopg2.connect(
		    database=database_credentials['database'],
		    user= database_credentials['user'],
		    password= database_credentials['password'],
		    host=database_credentials['host'],
		    port=database_credentials['port']
		)
		self.p_db.autocommit = True
		self.db = self.p_db.cursor()

	def closeConnection(self):
		self.db.close()
		self.p_db.close()

	# creates a new table with columns submission_id and time_stamp
	def createNewTable(self, table_name):
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (submission_id TEXT, time_stamp FLOAT)'
		self.db.execute(createTableCode)		

	# initializes the product submission table
	def createProductSubmissionTable(self):
		self.createNewTable(self.USER_SUBMISSION_TABLE)

	# initializes the product request table
	def createProductRequestTable(self):
		self.createNewTable(self.USER_REQUEST_TABLE)

	# checks if the given table has an entry with data in that given column name	
	def tableHasEntryWithProperty(self, table_name, column_name, entry):
		try:
			sql = "SELECT * FROM " + table_name + " WHERE %s = %s"
			self.db.execute(self.db.mogrify(sql (column_name, entry)))
		except:
			return False
		query = self.db.fetchall()
		return len(query) > 0

	# returns a random alphanumric character with size 20
	# used for generating submission_id
	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	# checks if the given table has the image id
	def isImageIdTaken(self, table_name, image_id):
		column_name = "image_id"
		return self.tableHasEntryWithProperty(table_name, column_name, image_id)

	# generates new image id for the given table
	def generateNewImageId(self, table_name):
		image_id = self.id_generator()
		while self.isImageIdTaken(table_name, image_id):
			image_id = self.id_generator()
		return image_id

	# checks if the given table has the image id
	def isUniqueIdTaken(self, table_name, submission_id):
		column_name = "submission_id"
		return self.tableHasEntryWithProperty(table_name, column_name, submission_id)
	
	# generates a new submission_id for the given table
	def generateNewUniqueId(self, table_name):
		submission_id = self.id_generator()
		while self.isUniqueIdTaken(submission_id, table_name):
			submission_id = self.id_generator()
		return submission_id

	# given a table, outputs the table as a dictionary 
	def getTableDataAsDict(self, table_name):
		keys = self.getColumnNames(table_name)
		sql = "SELECT * FROM " + table_name
		self.db.execute(sql)
		query = self.db.fetchall()
		output_list = list()
		for row in query:
			output = {}
			for i in range(0, len(keys)-1):
				output[keys[i]] = row[i]
			output_list.append(output)
		return output_list

	# returns a dictionary with all product submission
	def getProductSubmissions(self):
		allProducts = self.getTableDataAsDict(self.USER_SUBMISSION_TABLE)
		return allProducts

	# returns a dictionary with all request submissions
	def getRequestSubmissions(self):
		allRequests = self.getTableDataAsDict(self.USER_REQUEST_TABLE)
		return allRequests

	# return true if a table has a given column
	# false otherwise
	def tableHasColumn(self, table_name, column_name):
		colnames = self.getColumnNames(table_name)
		return column_name in colnames

	# updates an entry given a table and it's submission_id
	def updateEntryByUniqueId(self, table_name, submission_id, column_name, data):	
		if column_name == "submission_id":
			return
		if column_name == "time_stamp":
			return		
		if data == None:
			return
		if not self.tableHasColumn(table_name, column_name):
			self.addColumnToTable(table_name, column_name)
		sql = "UPDATE " + table_name + " SET " + column_name + " = %s " + " WHERE submission_id = %s"
		self.db.execute(self.db.mogrify(sql, (data, submission_id)))

	# adds a column to a given table if it does not already exist
	def addColumnToTable(self, table_name, column_name, data_type = None):
		if self.tableHasColumn(table_name, column_name):
			return
		if data_type == None:
			data_type = "TEXT"
		sql = "ALTER TABLE " + table_name + " ADD " + column_name + " " + data_type
		self.db.execute(self.db.mogrify(sql))

	# returns the list of columns in a table given its name
	def getColumnNames(self, table_name):
		sql = "Select * FROM " + table_name
		self.db.execute(sql)
		colnames = self.db.fetchall()
		colnames = [desc[0] for desc in self.db.description]
		return colnames

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
			self.updateEntryByUniqueId(table_name, submission_id, column_name, data)

	# adds a product request to the database
	def addProductRequest(self, request):
		keys = product_request_database_columns
		self.createProductRequestTable()
		table_name = self.USER_REQUEST_TABLE
		submission_id = self.generateNewUniqueId(table_name)
		time_stamp = time.time()
		sql = "INSERT INTO " + table_name + " (submission_id, time_stamp) VALUES (%s, %s)"
		self.db.execute(self.db.mogrify(sql, (submission_id, time_stamp)))
		## add code to send us an email when this happens 
		email_api.sendRequestEmail(request)
		for key in keys:
			self.updateEntryByUniqueId(table_name, submission_id, key, request.get(key))

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
		print(submission.get('num_images'))
		for key in product_submission_database_columns:
			if submission.get(key) != None:
				if key != "submission_id":
					self.updateEntryByUniqueId(table_name, submission_id, key, submission[key])
	
	def test(self):
		keys = ['product_description',
				'price_min',
				'price_max',
				'contact_information']
		
		test_request = {}
		for key in keys:
			test_request[key] = "test"

		self.addProductRequest(test_request)





if __name__ == '__main__':
	product_data_manager = ProductDataManager()
	# print(product_data_manager.tableHasColumn("USER_REQUEST_TABLE", "submission_id"))
	# print(product_data_manager.tableHasColumn("USER_REQUEST_TABLE", "product_description"))
	# product_data_manager.test()
	data = product_data_manager.getRequestSubmissions()
	product_data_manager.closeConnection()

