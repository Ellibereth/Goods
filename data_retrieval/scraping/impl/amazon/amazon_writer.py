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

sys.path.append('../../../../credentials')
import credential 

class AmazonWriter:
	def __init__(self):
		self.AMAZON_SCRAPING_TABLE = "AMAZON_SCRAPING_TABLE"
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

	def openConnection(self):
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
		if Labels.Asin not in keys:
			return 

		# insert an item if not already exists
		if not self.tableHasAsin(product[Labels.Asin]):
			sql = "INSERT INTO " + self.AMAZON_SCRAPING_TABLE + " (" + Labels.Asin + ") VALUES (%s) "
			self.db.execute(self.db.mogrify(sql, (product[Labels.Asin],)))
		## update the rest keys in product
		for key in keys:
			self.updateEntryByAsin(product[Labels.Asin], key, product[key])

	def updateEntryByAsin(self, asin, column_name, data):	
		# try:
		# 	self.addColumnToScrapingTable(column_name)
		# except:
		# 	print("column exists alredy")

		sql = "UPDATE " + self.AMAZON_SCRAPING_TABLE + " SET " + column_name + " = %s " + " WHERE " + Labels.Asin + " = %s"
		self.db.execute(self.db.mogrify(sql, (data, asin)))

	def tableHasAsin(self, asin):
		# self.createScrapingDataTable()
		sql = "SELECT * FROM " + self.AMAZON_SCRAPING_TABLE + " WHERE " + Labels.Asin + " = %s"
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

