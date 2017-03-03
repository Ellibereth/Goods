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
		os.environ["DATABASE_URL"] = "postgres://spkgochzoicojm:y0MABz523D1H-zMqeZVvplCuC2@ec2-54-163-252-55.compute-1.amazonaws.com:5432/d15b0teu2kkhek"
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
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (product_name TEXT, manufacturer_name TEXT, location TEXT, url_link TEXT, image_id TEXT, timeStamp FLOAT)'
		self.db.execute(createTableCode)

	def isImageIdTaken(self, image_id):
		sql = "SELECT * FROM " + self.USER_SUBMISSION_TABLE + " WHERE image_id = %s"
		self.db.execute(self.db.mogrify(sql, (image_id,)))
		query = self.db.fetchall()
		if len(query) > 0:
			return True
		else:
			return False

		# check if there is a duplicate in the directory 

	

	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	def generateNewImageId(self):
		image_id = self.id_generator()
		while self.isImageIdTaken(image_id):
			image_id = self.id_generator()
		return image_id

	def addProductEntry(self, product_name, manufacturer_name, location, url_link, image_data):
		self.createProductEntryTable()
		image_id = self.generateNewImageId()

		# write the image file to memory as a png, if there is image data
		if image_data != "":
			image_bytes = image_data.encode('utf-8')
			image_decoded = base64.decodestring(image_bytes)
			with open("data/images/product_submissions/" + image_id + ".png", "wb") as fh:
			    fh.write(image_decoded)

		## insert into the database
		timeStamp = time.time()
		sql = self.db.mogrify("INSERT INTO " + self.USER_SUBMISSION_TABLE + " (product_name, manufacturer_name, location, url_link, image_id, timeStamp) VALUES (%s,%s,%s,%s,%s,%s)"
					,(product_name, manufacturer_name, location, url_link, image_id, timeStamp))
		self.db.execute(sql)
