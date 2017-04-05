import unittest
from unittest.mock import MagicMock
import string
import random
import time
import copy
from api.utility.market_product import MarketProductManager
from api.utility.table_names import TestTables

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
Images = "images"
MainImage = "main_image"
Inventory = "inventory"




class TestMarketProductManager(unittest.TestCase):

	def setUp(self):		

		self.test_product = {
								Inventory : "20", 
								Manufacturer : "Test Manufacturer",
								Brand : "Test Brand", 
								Price : 55,
								Description : "Test Description",
								Name : "Test Name",
								Category : "Test Category"
							}
		self.entry_length = 5
		self.input_vars = [Inventory, Manufacturer, Brand, Price, Description, Name, Category]
		self.num_rows = 1
		self.initializeTestTable()

	def tearDown(self):
		self.sql.closeConnection()

	# we genrate a random dictionary to insert into the table
	def generateRandomDict(self):
		random_dict = {}
		for key in self.input_vars:
			if key == Inventory or key == Price:
				random_dict[key] = random.randint(0,20)
			else:
				random_dict[key] = self.sql.generateUniqueIdForColumn(key, self.entry_length)
		random_dict[TimeStamp] = time.time()
		return random_dict

	# initializes a random table 
	def initializeTestTable(self):
		self.sql = MarketProductManager(TestTables.MarketProductTable)
		self.sql.clearTable()
		self.sql.closeConnection()
		self.sql = MarketProductManager(TestTables.MarketProductTable)
		self.sql.isMarketProductSubmissionValid = MagicMock(return_value = {Success : "True"})
		for i in range(0, self.num_rows):
			random_product = self.generateRandomDict()
			self.sql.addMarketProduct(random_product)

		self.sql.closeConnection()
		self.sql = MarketProductManager(TestTables.MarketProductTable)
		expected_num_rows = self.sql.getNumRows()
		return (expected_num_rows == self.num_rows)

	# also tests addUser function through initialization
	def testAddMarketProduct(self):
		self.assertTrue(self.initializeTestTable())

	# tests get market product  
	def testGetMarketProductById(self):
		TEST_PRODUCT_ID = "TEST_PRODUCT_ID"
		# make sure there are none to start with
		# which there shouldn't!
		self.sql.generateProductId = MagicMock(return_value = TEST_PRODUCT_ID)
		old_size = self.sql.getNumRows()
		self.assertEqual(len(self.sql.getMarketProducts()), old_size)
		
		self.sql.addMarketProduct(self.test_product)
		new_size = self.sql.getNumRows()
		self.assertEqual(new_size, old_size + 1)
		out_product = self.sql.getMarketProductById(TEST_PRODUCT_ID)
		self.assertEqual(len(self.sql.getMarketProducts()), old_size + 1)
		for key in self.input_vars:
			self.assertEqual(self.test_product[key], out_product[key])

		self.sql.addMarketProduct(self.test_product)
		self.assertEqual(self.sql.getNumRows(), old_size + 2)
		self.assertEqual(len(self.sql.getMarketProducts()), old_size + 2)

	# submissions must be a dict in the following form
	# 1. Inventory must be an string that is parseable as an integer
	# 2. Price must be an string that is parseable as a float
	# 3. Certain categories cannot be None or missing
	def testIsMarketProductSubmissionValidGoodSubmission(self):
		self.assertTrue(self.sql.isMarketProductSubmissionValid(self.test_product)[Success])

	def testIsMarketProductSubmissionValidPriceNotNumber(self):
		self.test_product[Price] = "not a number"
		self.assertFalse(self.sql.isMarketProductSubmissionValid(self.test_product)[Success])

	def testIsMarketProductSubmissionValidInventoryNotInteger(self):
		self.test_product[Inventory] = "not a number"
		self.assertFalse(self.sql.isMarketProductSubmissionValid(self.test_product)[Success])
		self.test_product[Inventory] = 5.4
		self.assertFalse(self.sql.isMarketProductSubmissionValid(self.test_product)[Success])
		self.test_product[Inventory] = "16.8"
		self.assertFalse(self.sql.isMarketProductSubmissionValid(self.test_product)[Success])




		
