import time
import string
import random
import psycopg2
import base64
import email_api
import sys
from sql_manager import SqlManager

# this class will only call information from Amazon
class AmazonManager:
	def __init__(self):
		self.AMAZON_SCRAPING_TABLE = "AMAZON_SCRAPING_TABLE"
		self.sql = SqlManager(self.AMAZON_SCRAPING_TABLE)
		
	# closes the connection to the postgre sql database
	def closeConnection(self):
		self.sql.closeConnection()

	def getAmazonProducts(self):
		amazon_products = self.sql.tableToDict()
		return amazon_products

	def getProductsMadeInUsa(self):
		amazon_products = self.getAmazonProducts()
		usa_products = list()
		for product in amazon_products:
			if self.isProductMadeInUsa(product):
				usa_products.append(product)
		return usa_products

	# gets a product as a dict and returns yes if the origin has USA, but not imported
	# this product must have a key 'origin'
	# rules if it has the substrings 
	# " us", "us ", "usa" , "america", "united states"
	def isProductMadeInUsa(self, product):
		raw_origin = product.get('origin')
		if raw_origin == None:
			return False
		origin = raw_origin.lower()
		found_target = False
		target_strings = [" us", "us ", "usa" , "america", "united states"]
		for target_string in target_strings:
			index = origin.find(target_string)
			if index != -1:
				found_target = True
		invalidated = False
		invalidating_strings = ['imported', 'australia', 'belarus', 'cyprus','mauritius','russia']
		for invalidating_string in invalidating_strings:
			index = origin.find(invalidating_string)
			if index != -1:
				invalidated = True 
		isUsa = found_target and not invalidated
		return isUsa
		
	def getProductInfoByAsin(self, asin):
		column_name = "asin"
		product = self.sql.getRowByUniqueProperty(column_name, asin)
		return product

	def isAsinMadeInUsa(self, asin):
		product = self.getProductInfoByAsin(asin)
		return self.isProductMadeInUsa(asin)

	def writeTableToCsv(self):
		self.sql.writeTableToCsv()

	def writeUsaProductsToCsv(self):
		usa_products = self.getProductsMadeInUsa()
		self.sql.writeDictToCsv("USA_PRODUCTS", usa_products)

	def main(self):
		asin = "B00THLYG8A"
		product = self.getProductInfoByAsin(asin)
		print(product)
		









