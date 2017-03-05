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
import openpyxl

class AmazonWriter:
	def __init__(self):
		self.AMAZON_SCRAPING_TABLE = "AMAZON_SCRAPING_TABLE"
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


	## all entries will be TEXT except
	def createScrapingDataTable(self):
		table_name = self.AMAZON_SCRAPING_TABLE
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (asin TEXT)'
		self.db.execute(createTableCode)

	# by default all columns will be TEXT
	def addColumnToScrapingTable(self, column_name):
		sql = "ALTER TABLE " + self.AMAZON_SCRAPING_TABLE + " ADD " + column_name + " TEXT"
		self.db.execute(self.db.mogrify(sql))

	# takes a dictionary called product as input, then writes each element to each row
	def addProductEntryToDataTable(self, product):
		if product == None:
			return 
		self.createScrapingDataTable()
		keys = product.keys()
		if len(keys) == 0:
			return
		# if there is no ASIN in there, it feels useless, figure out how to get the asin always
		# log if this happens
		if 'asin' not in keys:
			return 
		if not self.tableHasAsin(product['asin']):
			# insert an item 
			sql = "INSERT INTO " + self.AMAZON_SCRAPING_TABLE + " (asin) VALUES (%s) "
			self.db.execute(self.db.mogrify(sql, (product['asin'],)))
		## update the rest keys in product
		for key in keys:
			self.updateEntryByAsin(product['asin'], key, product[key])

	def updateEntryByAsin(self, asin, column_name, data):	
		# try:
		# 	self.addColumnToScrapingTable(column_name)
		# except:
		# 	print("column exists alredy")

		sql = "UPDATE " + self.AMAZON_SCRAPING_TABLE + " SET " + column_name + " = %s " + " WHERE asin = %s"
		self.db.execute(self.db.mogrify(sql, (data, asin)))

	def tableHasAsin(self, asin):
		# self.createScrapingDataTable()
		sql = "SELECT * FROM " + self.AMAZON_SCRAPING_TABLE + " WHERE asin = %s"
		self.db.execute(self.db.mogrify(sql, (asin,)))
		if self.db.rowcount == 0:
			return False
		else:
			return True

	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	def writeTableToCsv(self):
		sql = "SELECT * FROM " + self.AMAZON_SCRAPING_TABLE
		self.db.execute(sql)
		if self.db.rowcount == 0:
			return 
		
		query = self.db.fetchall()
		wb = openpyxl.Workbook()
		ws = wb.active
		# Rows can also be appended
		for row in query:
			ws.append(row)

		# Save the file
		wb.save("./database/amazon_table.xlsx")


