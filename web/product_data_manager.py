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

class ProductDataManager:
	def __init__(self):
		self.USER_SUBMISSION_TABLE = "USER_SUBMISSION_TABLE"
		urllib.parse.uses_netloc.append("postgres")
		os.environ["DATABASE_URL"] = "postgres://hwdeympyzrxlzq:1083131fdf083180520fadbf5dd7fc0161410fcbccef02059fce434b839a287d@ec2-75-101-142-182.compute-1.amazonaws.com:5432/d82cfb87nis5in"
		url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
		self.p_db = psycopg2.connect(
		    database=url.path[1:],
		    user=url.username,
		    password=url.password,
		    host=url.hostname,
		    port=url.port,
		)
		self.p_db.autocommit = True
		self.db = self.p_db.cursor()

	def closeConnection(self):
		self.db.close()
		self.p_db.close()

	def createProductEntryTable(self):
		table_name = self.USER_SUBMISSION_TABLE
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (unique_id TEXT, image_id TEXT, timeStamp FLOAT)'
		self.db.execute(createTableCode)

	def isImageIdTaken(self, image_id):
		sql = "SELECT * FROM " + self.USER_SUBMISSION_TABLE + " WHERE image_id = %s"
		self.db.execute(self.db.mogrify(sql, (image_id,)))
		query = self.db.fetchall()
		if len(query) > 0:
			return True
		else:
			return False

	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	def generateNewImageId(self):
		image_id = self.id_generator()
		while self.isImageIdTaken(image_id):
			image_id = self.id_generator()
		return image_id

	def isImageIdTaken(self, image_id):
		sql = "SELECT * FROM " + self.USER_SUBMISSION_TABLE + " WHERE image_id = %s"
		self.db.execute(self.db.mogrify(sql, (image_id,)))
		query = self.db.fetchall()
		if len(query) > 0:
			return True
		else:
			return False

	def isUniqueIdTaken(self, unique_id):
		sql = "SELECT * FROM " + self.USER_SUBMISSION_TABLE + " WHERE unique_id = %s"
		self.db.execute(self.db.mogrify(sql, (unique_id,)))
		query = self.db.fetchall()
		if len(query) > 0:
			return True
		else:
			return False
	
	def generateNewUniqueId(self):
		unique_id = self.id_generator()
		while self.isUniqueIdTaken(unique_id):
			unique_id = self.id_generator()
		return unique_id

	# takes submission dictionary
	def addProductEntry(self, submission):
		self.createProductEntryTable()
		image_id = self.generateNewImageId()
		image_data = submission.get("image_data")
		# write the image file to memory as a png, if there is image data
		if image_data != None and image_data != "":
			image_bytes = image_data.encode('utf-8')
			image_decoded = base64.decodestring(image_bytes)
			with open("data/images/product_submissions/" + image_id + ".png", "wb") as fh:
			    fh.write(image_decoded)
			submission['image_id'] = image_id
		
		for key in submission:
			if submission.get(key) == None:
				submission[key] = ""

		## insert into the database
		timeStamp = time.time()
		unique_id = self.generateNewUniqueId()
		sql = self.db.mogrify("INSERT INTO " + self.USER_SUBMISSION_TABLE + " (unique_id, timeStamp) VALUES (%s, %s)"
					,(unique_id, timeStamp))
		self.db.execute(sql)
		for key in submission:
			if key != "image_data":
				self.updateEntryByUniqueId(unique_id, key, submission[key])


	def updateEntryByUniqueId(self, unique_id, column_name, data):	
		try:
			self.addColumnToSubmissionTable(column_name)
		except:
			print("column exists alredy")

		sql = "UPDATE " + self.USER_SUBMISSION_TABLE + " SET " + column_name + " = %s " + " WHERE unique_id = %s"
		self.db.execute(self.db.mogrify(sql, (data, unique_id)))

	def addColumnToSubmissionTable(self, column_name):
		sql = "ALTER TABLE " + self.USER_SUBMISSION_TABLE + " ADD " + column_name + " TEXT"
		self.db.execute(self.db.mogrify(sql))

