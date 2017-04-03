import time
import string
import random
import psycopg2
import base64
import copy
from api.utility import email_api
from api.utility.sql_manager import SqlManager
from passlib.hash import argon2
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables

from api.utility.stripe_api import StripeManager

MIN_PASSWORD_LENGTH = 6


class Labels:
	TimeStamp = "time_stamp"
	StripeCustomerId = "stripe_customer_id"
	AccountId = "account_id"
	Success = "success"
	Error = "error"
	StripeId = "stripe_id"
	OrderId = "order_id"
	ProductId = "product_id"
	RefundDate = "refund_date"
	StripeChargeId = "stripe_charge_id"
	Id = "id"

table_columns = [
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.OrderId, "type" : "TEXT"},
						{"name" : Labels.ProductId, "type" : "TEXT"},
						{"name" : Labels.AccountId,	"type" : "TEXT"},
						{"name" : Labels.StripeCustomerId, "type" : "TEXT"},
						{"name" : Labels.StripeChargeId, "type" : "TEXT"},
						{"name" : Labels.RefundDate, "type" : "FLOAT"}
					]

class OrderManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.OrderTable or table_name == TestTables.OrderTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createOrderTable()

	# initializes a user info table 
	def createOrderTable(self):
		self.createTableIfNotExists()
		for col in table_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# generates a new email_confirmation_id
	def generateOrderId(self):
		return self.generateUniqueIdForColumn(Labels.OrderId)

	def tableHasOrderId(self, order_id):
		return self.tableHasEntryWithProperty(Labels.OrderId, order_id)
		
	# inputs are user product and charge. From these we add the order to the database 
	# which we add to the database
	def addOrder(self, user, product, charge):
		if user == None or charge == None:
			return None
		order = {}
		order[Labels.TimeStamp] = time.time()
		order[Labels.OrderId] = self.generateOrderId()
		order[Labels.ProductId] = product[Labels.ProductId]
		order[Labels.AccountId] = user[Labels.AccountId]
		order[Labels.StripeCustomerId] = user[Labels.StripeCustomerId]
		order[Labels.StripeChargeId] = charge[Labels.Id]
		order[Labels.RefundDate] = None
		self.insertDictIntoTable(order)
		output_order = self.getRowByKey(Labels.OrderId, order[Labels.OrderId])
		return output_order

	# get all orders for this user
	# do you think the input should be the whole user or just the account_id? 
	def getUserOrders(self, user):
		output_order = self.getRowsByProperty(Labels.AccountId, user[Labels.AccountId])
		return output_order



