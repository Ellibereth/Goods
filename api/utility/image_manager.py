import time
import string
import random
import psycopg2
import base64
import copy
from api.utility.sql_manager import SqlManager
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.s3.s3 import S3Manager
from api.utility.labels import ImageManagerLabels as Labels

MIN_PASSWORD_LENGTH = 6


image_table_columns = [
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.ImageId, "type" : "TEXT"},
						{"name" : Labels.ProductId,		"type" : "TEXT"},
						{"name" : Labels.MainImage, "type" : "BOOL"},
						{"name" : Labels.DeletedDate, "type" : "FLOAT"}
					]


class ImageManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.ImageTable or table_name == TestTables.ImageTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createImageTable()

	def createImageTable(self):
		self.createTableIfNotExists(image_table_columns, primary_key = Labels.ImageId)
		self.addIndexIfNotExists(Labels.ProductId)
		self.addIndexIfNotExists(Labels.ImageId)

	# generates a new image id
	def generateImageId(self):
		return self.generateUniqueIdForColumn(Labels.ImageId)

	def tableHasImageId(self, image_id):
		return self.tableHasEntryWithProperty(Labels.ImageId, image_id)

	def addImage(self, product_id, image_data):
		image_id = self.generateImageId()
		# upload the image to s3
		s3 = S3Manager()
		s3.uploadProductImage(image_id, image_data)

		# store this in our database
		image_dict = {}
		image_dict[Labels.TimeStamp] = time.time()
		image_dict[Labels.ProductId] = product_id
		image_dict[Labels.ImageId] = image_id
		image_dict[Labels.DeletedDate] = None
		if self.productHasImages(product_id):
			image_dict[Labels.MainImage] = False
		else:
			image_dict[Labels.MainImage] = True
		self.insertDictIntoTable(image_dict)

	# do you think the argument for this should be a product dict/object as input or just the product_id?
	# returns a list of images
	def getImagesForProduct(self, product_id):
		return self.getRowsByProperty(Labels.ProductId, product_id)
		
	# returns true if the product has any images
	# used for assigning the first as the main image
	def productHasImages(self, product_id):
		return self.tableHasEntryWithProperty(Labels.ProductId, product_id)

	# assigns a new main image
	def assignNewMainImage(self, product_id, image_id):
		self.updateRowsByProperty(Labels.ProductId, product_id, Labels.MainImage, False)
		self.updateRowByKey(Labels.ImageId, image_id, Labels.MainImage, True)

		



