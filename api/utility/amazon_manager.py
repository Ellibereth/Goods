import time
import string
import random
import psycopg2
import base64
import sys
from api.utility.sql_manager import SqlManager
from api.utility import string_util 
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables

usa_origin_target_strings = [" us", "us ", "usa" , "america", "united states"]
usa_origin_invalidating_strings = ['imported', 'australia', 'belarus', 'cyprus','mauritius','russia']


class Labels:
	FinalOrigin = "final_origin"
	BrandNodeId = "brand_node_id"

# this class will only call information from Amazon
class AmazonManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.AmazonScrapingtable or table_name == TestTables.AmazonScrapingtable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)

	def getAmazonProducts(self):
		amazon_products = self.tableToDict()
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
		raw_origin = product.get(Labels.FinalOrigin)
		if raw_origin == None:
			return False
		origin = raw_origin.lower()
		found_target = string_util.stringHasTargetStrings(origin, usa_origin_target_strings)
		invalidated = string_util.stringHasTargetStrings(origin, usa_origin_invalidating_strings)
		isUsa = found_target and not invalidated
		return isUsa
		
	def getProductInfoByAsin(self, asin):
		column_name = "asin"
		product = self.getRowByUniqueProperty(column_name, asin)
		return product

	def isAsinMadeInUsa(self, asin):
		product = self.getProductInfoByAsin(asin)
		return self.isProductMadeInUsa(asin)

	def writeUsaProductsToXls(self):
		usa_products = self.getProductsMadeInUsa()
		self.writeDictToXls("USA_PRODUCTS", usa_products)

	def writeProductByUniqueBrand(self):
		allProducts = self.getAmazonProducts()
		existing_brand_nodes = list()
		output_dict_list = list()
		for product in allProducts:
			this_brand_node = product.get(Labels.BrandNodeId)
			if this_brand_node == None:
				this_brand_node = ""
			if this_brand_node not in existing_brand_nodes:
				output_dict_list.append(product)
				existing_brand_nodes.append(this_brand_node)
		self.writeDictToXls("UNIQUE_BY_BRAND", output_dict_list)

	def main(self):
		self.writeTableToXls()
		self.writeUsaProductsToXls()
		

if __name__ == "__main__":
	amazon = AmazonManager()
	amazon.main()
	amazon.closeConnection()







