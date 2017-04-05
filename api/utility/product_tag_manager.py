import time
import string
import random
import psycopg2
import base64
import copy
from api.utility.sql_manager import SqlManager
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.utility.labels import ProductTagLabels as Labels

MIN_PASSWORD_LENGTH = 6


product_tag_table_columns = [
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.ProductId, "type" : "TEXT"},
						{"name" : Labels.Tag,		"type" : "TEXT"},
						{"name" : Labels.ProductTagId, 		"type" : "TEXT"}
					]


class ProductTagManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.ProductTagTable or table_name == TestTables.ProductTagTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createProductTagTable()

	def createProductTagTable(self):
		self.createTableIfNotExists(product_tag_table_columns, primary_key = Labels.ProductTagId)
		self.addIndexIfNotExists(Labels.ProductId)
		# do you think tags should have their own index ?
		# self.addIndexIfNotExists(Labels.Tag)

	# generates a new image id
	def generateProductTagId(self):
		return self.generateUniqueIdForColumn(Labels.ProductTagId)

	def tableHasProductTagId(self, product_tag_id):
		return self.tableHasEntryWithProperty(Labels.ProductTagId, product_tag_id)

	## adds product tag to the database
	def addProductTag(self, product_id, tag):
		try:
			tag.lower()
		except:
			raise Exception("Tag is not a string")
		input_dict = {}
		input_dict[Labels.ProductId] = product_id
		input_dict[Labels.Tag] = tag.lower()
		input_dict[Labels.ProductTagId] = self.generateProductTagId()
		input_dict[Labels.TimeStamp] = time.time()
		self.insertDictIntoTable(input_dict)




	# more functionality in this class coming soon, for now just saving tags with product id
		



