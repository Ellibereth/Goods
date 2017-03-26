import time
import string
import random
import psycopg2
import base64
from api.utility import email_api
from api.utility.sql_manager import SqlManager
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables

market_problem_columns = [
						{"name" : "time_stamp", "type" : "FLOAT"},
						{"name" : "price",		"type" : "TEXT"},
						{"name" : "manufacturer", "type" : "TEXT"},
						{"name" : "name", "type": "TEXT"},
						{"name" : "product_id", "type" : "TEXT"},
						{"name" : "category", "type" : "TEXT"},
						{"name" : "description", "type" : "TEXT"},
						{"name" : "brand", "type" : "TEXT"}
						## rating tbd
						# {"name" : "rating", "type" : "TEXT"}
					]

class Labels:
	TimeStamp = "time_stamp"
	ProuctId = "product_id"
	Success = "success"
	Error = "error"
	ProductId = "product_id"
	Manufacturer = "manufacturer"
	Price = "price"
	Brand = "brand"
	Desccription = "description"
	Category = "category"
	Rating = "rating"

class MarketProductManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.MarketProductTable or table_name == TestTables.MarketProductTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createMarketProductTable()

	# initializes a market product table 
	def createMarketProductTable(self):
		self.createNewTableIfNotExists()
		for col in market_problem_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# generates a new email_confirmation_id
	def generateProductId(self):
		return self.generateUniqueIdForColumn(Labels.ProductId)

	def tableHasProductId(self, product_id):
		return self.tableHasEntryWithProperty(Labels.ProductId, product_id)

	# adds a product to display on the market
	def addMarketProduct(self, market_product):
		self.createMarketProductTable()
		market_product[Labels.ProductId] = self.generateProductId()
		market_product[Labels.TimeStamp] =  time.time()
		self.insertDictIntoTable(market_product)
		return {Labels.Success : True}

	# returns all market products as a dictionary
	def getMarketProducts(self):
		return self.tableToDict()

	def getMarketProductById(self, product_id):
		return self.getRowByUniqueProperty(Labels.ProductId, product_id)


