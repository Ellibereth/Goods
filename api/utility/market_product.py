import time
import string
import random
import psycopg2
import base64
from api.utility import email_api
from api.utility.sql_manager import SqlManager
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.s3.s3 import S3Manager



class Labels:
	TimeStamp = "time_stamp"
	ProuctId = "product_id"
	Success = "success"
	Error = "error"
	ProductId = "product_id"
	Manufacturer = "manufacturer"
	Price = "price"
	Brand = "brand"
	Description = "description"
	Category = "category"
	Rating = "rating"
	Name = "name"
	NumImages = "num_images"

MARKET_PHOTO_STORAGE_BUCKET = "publicmarketproductphotos" 	

market_problem_columns = [
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.Price,		"type" : "TEXT"},
						{"name" : Labels.Manufacturer, "type" : "TEXT"},
						{"name" : Labels.Name, "type": "TEXT"},
						{"name" : Labels.ProductId, "type" : "TEXT"},
						{"name" : Labels.Category, "type" : "TEXT"},
						{"name" : Labels.Description, "type" : "TEXT"},
						{"name" : Labels.Brand, "type" : "TEXT"},
						{"name" : Labels.NumImages, "type" : "INTEGER"}
						## rating tbd
						# {"name" : "rating", "type" : "TEXT"}
					]

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
		market_product[Labels.NumImages] = 0
		self.insertDictIntoTable(market_product)
		return {Labels.Success : True}

	# adds the image so s3 with the image id in the form 
	# <photo_id>_<number>
	def uploadMarketProductImage(self, product_id, photo_data):
		this_product = self.getMarketProductById(product_id)
		## add photo data to S3 database
		photo_name = this_product[Labels.ProductId] + "_" + str(this_product[Labels.NumImages])
		s3 = S3Manager()
		s3.uploadImage(MARKET_PHOTO_STORAGE_BUCKET, photo_name, photo_data)
		## update the number of photos 	
		self.updateEntryByKey(Labels.ProductId, this_product[Labels.ProductId], Labels.NumImages, this_product[Labels.NumImages] + 1)

	# returns all market products as a dictionary
	def getMarketProducts(self):
		return self.tableToDict()

	# returns the product by id
	def getMarketProductById(self, product_id):
		return self.getRowByUniqueProperty(Labels.ProductId, product_id)


