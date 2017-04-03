import unittest
from unittest.mock import MagicMock
import string
import random
import time
import copy
from api.utility.order_manager import OrderManager
from api.utility.table_names import TestTables


TimeStamp = "time_stamp"
StripeCustomerId = "stripe_customer_id"
AccountId = "account_id"
Success = "success"
Error = "error"
OrderId = "order_id"
ProductId = "product_id"
RefundDate = "refund_date"
StripeChargeId = "stripe_charge_id"
Id = "id"


# this order will not be randomly generated
# these inputs are how the user, product and charge inputs will come from 
# the other sql calls
test_user = {
				AccountId : "acc",
				StripeCustomerId : "cust",
		}
test_product = {
			ProductId : "prod"
			}
test_charge = {
			Id : "char"
			}

class TestOrderManager(unittest.TestCase):

	def setUp(self):		
		self.entry_length = 5
		self.col_names = [Id, StripeChargeId, StripeCustomerId, AccountId, OrderId, ProductId, RefundDate]
		self.input_vars = [Id, StripeChargeId, StripeCustomerId, AccountId, OrderId, ProductId, RefundDate]
		self.col_names.append(TimeStamp)
		self.num_rows = 1
		self.initializeTestTable()

	def tearDown(self):
		self.sql.closeConnection()

	# we genrate a random dictionary to insert into the table
	def generateRandomDict(self):
		random_dict = {}
		for key in self.input_vars:
			random_dict[key] = self.sql.generateUniqueIdForColumn(key, self.entry_length)
		random_dict[TimeStamp] = time.time()
		random_dict[RefundDate] = time.time()
		return random_dict

	# initializes a random table 
	def initializeTestTable(self):
		self.sql = OrderManager(TestTables.OrderTable)
		self.sql.clearTable()
		self.sql.closeConnection()
		self.sql = OrderManager(TestTables.OrderTable)
		for i in range(0, self.num_rows):
			input_list = list()
			for j in range(0, 3):
				input_list.append(self.generateRandomDict())
			self.sql.addOrder(input_list[0], input_list[1], input_list[2])

		expected_num_rows = self.sql.getNumRows()
		return (expected_num_rows == self.num_rows)

	def testAtFirstInitializeTestTable(self):
		self.assertTrue(self.initializeTestTable())

	# tests get transcations and add orders
	def testAddAndGetOrder(self):
		# make sure there are none to start with
		# which there shouldn't!
		self.assertEqual(len(self.sql.getUserOrders(test_user)), 0)
		old_size = self.sql.getNumRows()

		self.sql.addOrder(test_user, test_product, test_charge)
		new_size = self.sql.getNumRows()
		self.assertEqual(new_size, old_size + 1)
		out_order = self.sql.getUserOrders(test_user)
		self.assertEqual(len(self.sql.getUserOrders(test_user)), 1)
		self.assertEqual(test_user[AccountId], out_order[0][AccountId])
		self.assertEqual(test_user[StripeCustomerId], out_order[0][StripeCustomerId])
		self.assertEqual(test_product[ProductId], out_order[0][ProductId])
		self.assertEqual(test_charge[Id], out_order[0][StripeChargeId])

		self.sql.addOrder(test_user, test_product, test_charge)
		self.assertEqual(self.sql.getNumRows(), old_size + 2)
		self.assertEqual(len(self.sql.getUserOrders(test_user)), 2)

		
