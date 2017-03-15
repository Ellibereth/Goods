import time
import string
import random
import time
import psycopg2
from credentials import credential
						 
class SqlManager:
	def __init__(self):
		self.USER_SUBMISSION_TABLE = "USER_SUBMISSION_TABLE"
		self.USER_REQUEST_TABLE = "USER_REQUEST_TABLE"
		database_credentials = credential.getDatabaseCredentials()
		self.p_db = psycopg2.connect(
		    database=database_credentials['database'],
		    user= database_credentials['user'],
		    password= database_credentials['password'],
		    host=database_credentials['host'],
		    port=database_credentials['port']
		)
		self.p_db.autocommit = True
		self.db = self.p_db.cursor()

	def closeConnection(self):
		self.db.close()
		self.p_db.close()

	# creates a new table with columns submission_id and time_stamp
	def createNewTableIfNotExists(self, table_name):
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (time_stamp FLOAT)'
		self.db.execute(createTableCode)		

	# checks if the given table has an entry with data in that given column name	
	def tableHasEntryWithProperty(self, table_name, column_name, entry_data):
		try:
			sql = "SELECT * FROM " + table_name + " WHERE " + column_name + " = %s"
			self.db.execute(self.db.mogrify(sql, (entry_data,)))
		except:
			return False
		query = self.db.fetchall()
		return len(query) > 0

	# returns a random alphanumric character with size 20
	# used for generating randoms ids
	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	# given a table, outputs the table as a dictionary 
	def tableToDict(self, table_name):
		keys = self.getColumnNames(table_name)
		sql = "SELECT * FROM " + table_name
		self.db.execute(sql)
		query = self.db.fetchall()
		output_list = list()
		for row in query:
			output = {}
			for i in range(0, len(keys)-1):
				output[keys[i]] = row[i]
			output_list.append(output)
		return output_list

	# return true if a table has a given column
	# false otherwise
	def tableHasColumn(self, table_name, column_name):
		colnames = self.getColumnNames(table_name)
		return column_name in colnames


	# returns the data type of data in string form for 
	# as the data type we want in the sql database
	# for example if data = True
	# will return "BOOL"
	# if our case work doesn't find it defaults to TEXT
	def getDataTypeString(self, data):
		data_type = type(data)
		output = "TEXT"
		if data_type is int:
			output = "INTEGER"
		elif data_type is float:
			output = "FLOAT"
		elif data_type is bool:
			output = "BOOL"
		elif data_type is str:
			output = "TEXT"
		elif data_type is dict:
			return
		elif data_type is list:
			return
		else:
			output = "TEXT"
		return output

	# insert row into table 
	# we need a way to insert a generic row into a table, but I'm not sure how to do this yet
	# this is a WIP
	def insertIntoTableWithInitialValue(self, table_name, initial_column_name, initial_value):
		sql = "INSERT INTO " + table_name + " (" + initial_column_name + ") VALUES (%s)"
		mogrified_sql = self.db.mogrify(sql, (initial_value,))
		self.db.execute(mogrified_sql)

	#  given the table name, updates the entries that data key in the column key_column_name
	#  such that their entries in the column target_column_name have value data
	#  if target_column_name doesn't exists, it creates it with value 
	# this key is not necessarily unique!
	def updateEntryByKey(self, table_name, key_column_name, key, target_column_name, data):	
		if not self.tableHasColumn(table_name, target_column_name):
			data_type = self.getDataTypeString(data)
			self.addColumnToTableIfNotExists(table_name, target_column_name, data_type = data_type)
		sql = "UPDATE " + table_name + " SET " + target_column_name + " = %s " + " WHERE " + key_column_name + " = %s"
		mogrified_sql = self.db.mogrify(sql, (data, key))
		self.db.execute(mogrified_sql)

	# adds a column to a given table if it does not already exist
	def addColumnToTableIfNotExists(self, table_name, column_name, data_type = None):
		if self.tableHasColumn(table_name, column_name):
			return
		if data_type == None:
			data_type = "TEXT"
		sql = "ALTER TABLE " + table_name + " ADD " + column_name + " " + data_type
		self.db.execute(self.db.mogrify(sql))

	# returns the list of columns in a table given its name
	def getColumnNames(self, table_name):
		sql = "Select * FROM " + table_name
		self.db.execute(sql)
		colnames = self.db.fetchall()
		colnames = [desc[0] for desc in self.db.description]
		return colnames

	# deletes a row from a table by submission_id
	def deleteRowFromTableByProperty(self, table_name, column_name, value):
		sql = "DELETE FROM " + table_name + " WHERE " + column_name + " = %s"
		mogrified_sql = self.db.mogrify(sql, (value,))
		self.db.execute(mogrified_sql)

	## returns a single row from a table given a unique property 
	## returns the row as a dictionary
	def getRowByUniqueProperty(self, table_name, column_name, value):
		try:
			sql = "SELECT * FROM " + table_name + " WHERE " + column_name + " = %s"
			mogrified_sql = self.db.mogrify(sql, (value,))
			self.db.execute(mogrified_sql)
		except:
			return None
		query = self.db.fetchall()
		row = query[0]
		output = {}
		keys = self.getColumnNames(table_name)
		for i in range(0, len(keys)):
			output[keys[i]] = row[i]
		return output

	# merge sorts an output from tableToDict by time_stamp
	def mergeSort(self, x):
		result = []
		if len(x) < 2:
			return x
		mid = int(len(x)/2)
		y = self.mergeSort(x[:mid])
		z = self.mergeSort(x[mid:])
		while (len(y) > 0) or (len(z) > 0):
			if len(y) > 0 and len(z) > 0:
				# this is in case the time stamp is blank
				if y[0]['time_stamp'] == None:
					y_time_stamp = 0
				else:
					y_time_stamp = y[0]['time_stamp']
				if z[0]['time_stamp'] == None:
					z_time_stamp = 0
				else:
					z_time_stamp = z[0]['time_stamp']
				if y_time_stamp > z_time_stamp:
					result.append(z[0])
					z.pop(0)
				else:
					result.append(y[0])
					y.pop(0)
			elif len(z) > 0:
				for i in z:
					result.append(i)
					z.pop(0)
			else:
				for i in y:
					result.append(i)
					y.pop(0)
		return result
