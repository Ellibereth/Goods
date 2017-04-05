import time
import string
import random
import psycopg2
import base64
from api.utility.sql_manager import SqlManager
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.utility.labels import MarketProductLabels as Labels
from api.utility.image_manager import ImageManager
from api.utility.product_tag_manager import ProductTagManager



MARKET_PHOTO_STORAGE_BUCKET = "publicmarketproductphotos" 	

market_product_columns = [
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.Price,		"type" : "FLOAT"},
						{"name" : Labels.Manufacturer, "type" : "TEXT"},
						{"name" : Labels.Name, "type": "TEXT"},
						{"name" : Labels.ProductId, "type" : "TEXT"},
						{"name" : Labels.Category, "type" : "TEXT"},
						{"name" : Labels.Description, "type" : "TEXT"},
						{"name" : Labels.Brand, "type" : "TEXT"},
						{"name" : Labels.NumImages, "type" : "INTEGER"},
						{"name" : Labels.Inventory, "type" : "INTEGER"},
						{"name" : Labels.SoftDeleted, "type" : "BOOLEAN"}

					]

class MarketProductManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.MarketProductTable or table_name == TestTables.MarketProductTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createTableIfNotExists(market_product_columns)
		self.addIndexIfNotExists(Labels.ProductId)
		self.addIndexIfNotExists(Labels.Name)
		# can add other indixes when necessary

	# generates a new email_confirmation_id
	def generateProductId(self):
		return self.generateUniqueIdForColumn(Labels.ProductId)

	def tableHasProductId(self, product_id):
		return self.tableHasEntryWithProperty(Labels.ProductId, product_id)

	# adds a product to display on the market
	def addMarketProduct(self, market_product):

		output = self.isMarketProductSubmissionValid(market_product)
		if not output[Labels.Success]:
			return output
			
		product_id = self.generateProductId() 
		market_product[Labels.ProductId] = product_id
		market_product[Labels.TimeStamp] =  time.time()
		market_product[Labels.NumImages] = 0
		market_product[Labels.SoftDeleted] = False
		self.insertDictIntoTable(market_product)
		return {Labels.Success : True, Labels.ProductId : product_id}

	# adds the image so s3 with the image id in the form 
	# <photo_id>_<number>
	def uploadMarketProductImage(self, product_id, image_data):
		this_product = self.getMarketProductById(product_id)
		## add photo data to S3 database with our image_manager object
		image_manager = ImageManager(ProdTables.ImageTable)
		image_manager.addImage(product_id, image_data)
		image_manager.closeConnection()
		self.updateRowsByProperty(Labels.ProductId, this_product[Labels.ProductId], Labels.NumImages, this_product[Labels.NumImages] + 1)

	# returns all market products as a dictionary
	def getMarketProducts(self):
		return self.tableToDict()

	# returns the product by id
	def getMarketProductById(self, product_id):
		market_product = self.getRowByKey(Labels.ProductId, product_id)
		image_manager = ImageManager(ProdTables.ImageTable)
		market_product[Labels.Images] = image_manager.getImagesForProduct(product_id)
		image_manager.closeConnection()
		return market_product

	# this method will tell if a market submission is valid
	# 1. Inventory must be an string that is parseable as an integer
	# 2. Price must be an string that is parseable as a float
	# 3. Certain categories cannot be None or missing
	def isMarketProductSubmissionValid(self, market_product):
		try:
			if float(market_product.get(Labels.Inventory)) % 1 != 0:
				return {Labels.Success : False, Labels.Error : "Inventory is not an integer value"}
			inventory = int(market_product.get(Labels.Inventory))
		except:
			return {Labels.Success : False, Labels.Error : "Inventory is not an integer value"}
		try:
			price = float(market_product.get(Labels.Price))
			market_product[Labels.Price] = round(price, 2)
		except:
			return {Labels.Success : False, Labels.Error : "Price is not a number"}


		return {Labels.Success : True}



