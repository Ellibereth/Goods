import time
import string
import random
import psycopg2
from api.utility import email_api
from api.utility.sql_manager import SqlManager
from passlib.hash import argon2
from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables


class Labels:
	Email = "email"
	TimeStamp = "time_stamp"
	AccountId = "account_id"
	Success = "success"
	Error = "error"
	TicketId = "ticket_id"
	DateResolved = "date_resolved"
	Rating = "rating"
	Subject = "subject"
	Body = "body"


# MIN_PASSWORD_LENGTH = 6
customer_service_ticket_columns = [
						{"name" : Labels.TicketId, "type" : "TEXT"},
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.AccountId, "type" : "TEXT"},
						{"name" : Labels.Subject, "type" : "TEXT"},
						{"name" : Labels.Body, "type" : "TEXT"},
						{"name" : Labels.DateResolved, "type" : "FLOAT"},
						{"name" : Labels.Rating, "type" : "TEXT"},
						{"name" : Labels.Email, "type" : "TEXT"},
					]

customer_service_response_columns = [
						{"name" : Lables.TicketId, "type" : "TEXT"},
						{"name" : Labels.TimeStamp, "type" : "FLOAT"},
						{"name" : Labels.AccountId, "type" : "TEXT"},
						{"name" : Labels.Subject, "type" : "TEXT"},
						{"name" : Labels.Body, "type" : "TEXT"},
						{"name" : Labels.DateResolved, "type" : "FLOAT"},
						{"name" : Labels.Rating, "type" : "TEXT"},
						{"name" : Labels.Email, "type" : "TEXT"},
					]

## class to handle sql entires to manage replies to customer service tickets
## each ticket will have a message thread along with it
class CustomerServiceResponse(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.CustomerServiceResponseTable or table_name == TestTables.CustomerServiceResponseTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createCustomerServiceResponseTable(cust_)

	def createCustomerServiceResponseTable(self):
		self.createTableIfNotExists()
		for col in customer_service_response_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])


## stores and manages the customer service inquiries
## think of a ticket for IT
class CustomerServiceTicket(SqlManager):
	def __init__(self, table_name):
		assert (table_name == ProdTables.CustomerServiceTicketTable or table_name == TestTables.CustomerServiceTicketTable)
		self.table_name = table_name
		SqlManager.__init__(self, self.table_name)
		self.createCustomerServiceTicketTable()

	# initializes a user info table 
	def createCustomerServiceTicketTable(self):
		self.createNewTableIfNotExists()
		for col in customer_service_ticket_columns:
			self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])

	# returns a new ticket id
	def generateTicketId(self):
		return self.generateUniqueId(Labels.TicketId)

	# given a ticket with the above columns, we add it to the database
	def addCutomerServiceTicketToTable(self, ticket):
		if ticket == None:
			return
		ticket[Labels.TimeStamp] = time.time()
		ticket[Labesl.TicketId] = self.generateTicketId()
		self.insertDictIntoTable(ticket)

	# resolves a customer ticket right now
	def resolveCustomerServiceTicket(self, ticket_id):
		self.updateRowsByProperty(Labels.TicketId, ticket_id, Labels.DateResolved, time.time())

	# returns the entire ticket informatio by the ticket id
	def getCustomerServiceTicketById(self, ticket_id):
		return self.getRowByUniqueProperty(Labels.TicketId, ticket_id)

	# returns all tickets that are not resolved
	# make sure you test this so SQL knows what to do with it
	def getUnresolvedTickets(self):
		return self.getRowsByProperty(Labels.DateResolved, None)


class CustomerServiceManager:
	def __init__(self):
		self.name = "Customer Service Manager"



