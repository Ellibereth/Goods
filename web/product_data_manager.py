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
database_columns = [
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


						 
class ProductDataManager:
	def __init__(self):
		self.USER_SUBMISSION_TABLE = "USER_SUBMISSION_TABLE"
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

	def isImageIdTaken(self, image_id):
		sql = "SELECT * FROM " + self.USER_SUBMISSION_TABLE + " WHERE image_id = %s"
		self.db.execute(self.db.mogrify(sql, (image_id,)))
		query = self.db.fetchall()
		return len(query) > 0


	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	def generateNewImageId(self):
		image_id = self.id_generator()
		while self.isImageIdTaken(image_id):
			image_id = self.id_generator()
		return image_id


	def isUniqueIdTaken(self, unique_id):
		sql = "SELECT * FROM " + self.USER_SUBMISSION_TABLE + " WHERE unique_id = %s"
		self.db.execute(self.db.mogrify(sql, (unique_id,)))
		query = self.db.fetchall()
		return len(query) > 0
	
	def generateNewUniqueId(self):
		unique_id = self.id_generator()
		while self.isUniqueIdTaken(unique_id):
			unique_id = self.id_generator()
		return unique_id

	# takes submission dictionary
	def addProductEntry(self, submission):
		self.createProductEntryTable()

		# write the image_id and store the data
		image_data = submission.get('images')
		if image_data != None:
			num_images = len(image_data)
			submission['num_images'] = num_images
			image_id = self.generateNewImageId()
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
					email = "darek@manaweb.com"
					email_api.sendImageEmail(email,image_name, image_decoded)
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
		unique_id = self.generateNewUniqueId()
		sql = self.db.mogrify("INSERT INTO " + self.USER_SUBMISSION_TABLE + " (unique_id, time_stamp) VALUES (%s, %s)"
					,(unique_id, time_stamp))
		self.db.execute(sql)
		print(submission.get('num_images'))
		for key in database_columns:
			if submission.get(key) != None:
				if key != "unique_id":
					self.updateEntryByUniqueId(unique_id, key, submission[key])

	# somehow you need to keep track of the order of things in the database
	# how can this be avoided in the future?
	# looking for suggestions
	def getProductSubmissions(self):
		sql = "SELECT * FROM " + self.USER_SUBMISSION_TABLE
		self.db.execute(sql)
		query = self.db.fetchall()
		allProducts = list()
		for row in query:
			product_dict = self.productSubmissionQueryRowToDict(row)
			allProducts.append(product_dict)

		return allProducts

	def productSubmissionQueryRowToDict(self, product_query):
		product_dict = {}
		i = 0
		for key in database_columns:
			product_dict[key] = product_query[i]
			i = i + 1
		num_images = product_dict.get('num_images')
		image_id = product_dict['image_id']
		if num_images != None and image_id != None and image_id != "":
			image_file_names = list()
			for i in range(0,num_images):
				image_file_names = product_dict['image_id'] + "_" + str(i) + ".png"
			product_dict['image_file_names'] =  image_file_names
		return product_dict

	def updateEntryByUniqueId(self, unique_id, column_name, data):	
		if column_name == "unique_id":
			return
		# try:
		# 	if column_name == "num_images":
		# 		self.addColumnToSubmissionTable(column_name, data_type = "INTEGER")
		# 	else:
		# 		self.addColumnToSubmissionTable(column_name)
		# except:
		# 	print("column exists alredy")

		sql = "UPDATE " + self.USER_SUBMISSION_TABLE + " SET " + column_name + " = %s " + " WHERE unique_id = %s"
		self.db.execute(self.db.mogrify(sql, (data, unique_id)))

	def addColumnToSubmissionTable(self, column_name, data_type = None):
		if data_type == None:
			data_type = "TEXT"
		sql = "ALTER TABLE " + self.USER_SUBMISSION_TABLE + " ADD " + column_name + " " + data_type
		self.db.execute(self.db.mogrify(sql))

	# returns the list of columns in a table given its name
	def getColumnNames(self, table_name = None):
		if table_name == None:
			table_name = self.USER_SUBMISSION_TABLE
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
			self.updateEntryByUniqueId(unique_id, column_name, data)

	def test(self):
		test_submission = {}
		for key in database_columns:
			if key == "time_stamp":
				test_submission[key] = time.time()
			elif key == "verified":
				test_submission[key] = False
			else:
				test_submission[key] = "test"

		self.addProductEntry(test_submission)
		product_submissions = self.getProductSubmissions()
		print(product_submissions)

if __name__ == '__main__':
	product_data_manager = ProductDataManager()
	col_names = product_data_manager.getColumnNames()
	print(col_names)
	product_data_manager.closeConnection()

