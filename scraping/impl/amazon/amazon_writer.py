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

from api.utility.sql_manager import SqlManager
from scraping.utility import credential
from scraping.utility.labels import Labels

class AmazonWriter(SqlManager):
	def __init__(self):
		self.AMAZON_SCRAPING_TABLE = "AMAZON_SCRAPING_TABLE"
		SqlManager.__init__(self, self.AMAZON_SCRAPING_TABLE)


	def addProductEntryToDataTableFast(self, product):
		self.insertDictIntoTable(product)

	def updateEntryByAsin(self, asin, column_name, data):
		if column_name not in self.getColumnNames():
			self.addColumnToScrapingTable(column_name)
		self.updateEntriesWithProperty('asin', asin, column_name, data)

	def tableHasAsin(self, asin):
		return self.tableHasEntryWithProperty('asin', asin)

	def writeTableToCsv(self):
		sql = "SELECT * FROM " + self.AMAZON_SCRAPING_TABLE
		self.db.execute(sql)
		if self.db.rowcount == 0:
			return 
		query = self.db.fetchall()
		wb = openpyxl.Workbook()
		ws = wb.active
		headers = self.getColumnNames()
		ws.append(headers)
		# Rows can also be appended
		for row in query:
			ws.append(row)
		# Save the file
		wb.save("./scraping/impl/amazon/database/amazon_table.xlsx")

