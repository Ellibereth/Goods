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
	TransactionId = "transaction_id"
	ProductId = "product_id"
	RefundDate = "refund_date"
	StripeChargeId = "stripe_charge_id"
	Id = "id"

table_columns = [
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.TransactionId, "type" : "TEXT"},
						{"name" : Labels.ProductId, "type" : "TEXT"},
						{"name" : Labels.AccountId,	"type" : "TEXT"},
						{"name" : Labels.StripeCustomerId, "type" : "TEXT"},
						{"name" : Labels.StripeChargeId, "type" : "TEXT"},
						{"name" : Labels.RefundDate, "type" : "FLOAT"}
					]

class TransactionManager(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.TransactionTable or table_name == TestTables.TransactionTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createTransactionTable()

	# initializes a user info table 
	def createTransactionTable(self):
		self.createTableIfNotExists()
		for col in table_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# generates a new email_confirmation_id
	def generateTransactionId(self):
		return self.generateUniqueIdForColumn(Labels.TransactionId)

	def tableHasTranscationId(self, transaction_id):
		return self.tableHasEntryWithProperty(Labels.TransactionId, transaction_id)
		
	# inputs are user product and charge. From these we add the transaction to the database 
	# which we add to the database
	def addTransaction(self, user, product, charge):
		if user == None or charge == None:
			return None
		transaction = {}
		transaction[Labels.TimeStamp] = time.time()
		transaction[Labels.TransactionId] = self.generateTransactionId()
		transaction[Labels.ProductId] = product[Labels.ProductId]
		transaction[Labels.AccountId] = user[Labels.AccountId]
		transaction[Labels.StripeCustomerId] = user[Labels.StripeCustomerId]
		transaction[Labels.StripeChargeId] = charge[Labels.Id]
		transaction[Labels.RefundDate] = None
		self.insertDictIntoTable(transaction)
		output_transaction = self.getRowByKey(Labels.TransactionId, transaction[Labels.TransactionId])
		return output_transaction

	# get all transactions for this user
	def getTransactionsForUser(self, account_id):
		output_transactions = self.getRowsByProperty(Labels.AccountId, account_id)
		return output_transactions



