import time
import datetime
import pytz
from pytz import timezone
import hashlib
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
							'id', 
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

product_submission_database_columns = [
								'unique_id'
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

	def createProductEntryTable(self):
		table_name = self.USER_SUBMISSION_TABLE
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (unique_id TEXT, image_id TEXT, time_stamp FLOAT)'
		self.db.execute(createTableCode)

	def createRequestTable(self):
		table_name = self.USER_REQUEST_TABLE
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (unique_id TEXT, time_stamp FLOAT)'
		self.db.execute(createTableCode)

	def isImageIdTaken(self, image_id, table_name):
		sql = "SELECT * FROM " + table_name + " WHERE image_id = %s"
		self.db.execute(self.db.mogrify(sql, (image_id,)))
		query = self.db.fetchall()
		return len(query) > 0


	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	def generateNewImageId(self, table_name):
		image_id = self.id_generator()
		while self.isImageIdTaken(image_id, table_name):
			image_id = self.id_generator()
		return image_id


	def isUniqueIdTaken(self, unique_id, table_name):
		sql = "SELECT * FROM " + table_name + " WHERE unique_id = %s"
		self.db.execute(self.db.mogrify(sql, (unique_id,)))
		query = self.db.fetchall()
		return len(query) > 0
	
	def generateNewUniqueId(self, table_name):
		unique_id = self.id_generator()
		while self.isUniqueIdTaken(unique_id, table_name):
			unique_id = self.id_generator()
		return unique_id

	# takes submission dictionary
	def addProductSubmission(self, submission):
		self.createProductEntryTable()
		table_name = self.USER_SUBMISSION_TABLE
		# write the image_id and store the data
		image_data = submission.get('images')
		if image_data != None:
			num_images = len(image_data)
			submission['num_images'] = num_images
			image_id = self.generateNewImageId(self.USER_SUBMISSION_TABLE)
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
		unique_id = self.generateNewUniqueId(self.USER_SUBMISSION_TABLE)
		sql = self.db.mogrify("INSERT INTO " + self.USER_SUBMISSION_TABLE + " (unique_id, time_stamp) VALUES (%s, %s)"
					,(unique_id, time_stamp))
		self.db.execute(sql)
		print(submission.get('num_images'))
		for key in product_submission_database_columns:
			if submission.get(key) != None:
				if key != "unique_id":
					self.updateEntryByUniqueId(unique_id, key, submission[key], table_name)


	def getProductSubmissions(self):
		allProducts = self.getTableDataAsDict(self.USER_SUBMISSION_TABLE)
		return allProducts

	def getRequestSubmissions(self):
		allRequests = self.getTableDataAsDict(self.USER_REQUEST_TABLE)
		return allRequests

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

	def tableHasColumn(self, table_name,column_name):
		colnames = self.getColumnNames(table_name)
		return column_name in colnames

	def updateEntryByUniqueId(self, unique_id, column_name, data, table_name):	
		if column_name == "unique_id":
			return
		if column_name == "time_stamp":
			return		
		if data == None:
			return
		if not self.tableHasColumn(table_name, column_name):
			self.addColumnToSubmissionTable(column_name)
		sql = "UPDATE " + self.USER_SUBMISSION_TABLE + " SET " + column_name + " = %s " + " WHERE unique_id = %s"
		self.db.execute(self.db.mogrify(sql, (data, unique_id)))

	def addColumnToSubmissionTable(self, column_name, data_type = None):
		if data_type == None:
			data_type = "TEXT"
		sql = "ALTER TABLE " + self.USER_SUBMISSION_TABLE + " ADD " + column_name + " " + data_type
		self.db.execute(self.db.mogrify(sql))

	# returns the list of columns in a table given its name
	def getColumnNames(self, table_name):
		sql = "Select * FROM " + table_name
		self.db.execute(sql)
		colnames = self.db.fetchall()
		colnames = [desc[0] for desc in self.db.description]
		return colnames

	# verifies a submission by unique_id
	def verifySubmission(self, unique_id):
		if unique_id == None or unique_id == "":
			return
		# if the unique id is not in use, then return 
		elif not self.isUniqueIdTaken(unique_id):
			return
		else:
			column_name = "verified"
			data = True
			self.updateEntryByUniqueId(unique_id, column_name, data, )

	def addProductRequest(self, request):
		self.createRequestTable()
		table_name = self.USER_REQUEST_TABLE
		unique_id = self.generateNewUniqueId(table_name)
		time_stamp = time.time()
		sql = "INSERT INTO " + table_name + " (unique_id, time_stamp) VALUES (%s, %s)"
		self.db.execute(self.db.mogrify(sql, (unique_id, time_stamp)))

		## add code to send us an email when this happens 
		email_api.sendRequestEmail(request)

		for key in keys:
			self.updateEntryByUniqueId(unique_id, key, request.get(key), table_name)





if __name__ == '__main__':
	product_data_manager = ProductDataManager()
	data = product_data_manager.getProductSubmissions()
	print(data)
	product_data_manager.closeConnection()

