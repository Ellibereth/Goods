import time
import string
import random
import time
import psycopg2
import openpyxl
from api.utility import credential

TimeStamp = "time_stamp"

## notes for next time, maybe include an assert or check to make sure
## that whenever something is added to a column, the column name is all lower case
class SqlManager:
	def __init__(self, table_name):
		self.table_name = table_name
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
		
		# right now we defualt the query limit to 10000 so we don't get bogged down
		# this probably won't matter for a while, but when it does we've gotten larger!
		self.query_limit = 10000
		# self.createTableIfNotExists()

	def closeConnection(self):
		self.db.close()
		self.p_db.close()


	# creates a new table with columns submission_id and time_stamp
	def createTableIfNotExists(self, columns = None, primary_key = None):
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.table_name + ' (' + TimeStamp + ' FLOAT)'
		self.db.execute(createTableCode)
		if columns != None:
			for col in columns:
				self.addColumnToTableIfNotExists(column_name = col['name'], data_type = col['type'])
		self.addPrimaryKey(primary_key)

	# testing to see if this is faster. It is much better for creating new tables, but really only important for testing
	# in practice since we won't make new tables very often, this is not that important
	# the reason this would be faster is that creating a tble and adding each column is less efficient than just 
	# having them at initialization
	def createTableIfNotExistsFast(self, columns = None, primary_key = None):
		if columns == None:
			createTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.table_name + ' (' + TimeStamp + ' FLOAT)'
		else:
			createTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.table_name + ' (' + TimeStamp + ' FLOAT '
			for col in columns:
				if col['name'] != TimeStamp:
					createTableCode =  createTableCode + ", " + col['name'] + ' ' + col['type']
			createTableCode = createTableCode + ')'
		self.db.execute(createTableCode)
		print(self.getColumnNames())
		self.addPrimaryKey(primary_key)

	# adds a primary key to a table
	def addPrimaryKey(self, primary_key):
		if primary_key == None:
			return
		try:
			sql = "ALTER TABLE " + self.table_name + " ADD PRIMARY KEY (" + primary_key + ")"
			self.db.execute(sql)
		except:
			return
			# this is nothing too bad, you just can't add an extra primary key to an SQL table. If this happens \
			# that just means the table already has a primary key. Looking for a better way than this though :3 \
			# Didn't really want to dwell on this too long though


	# adds an index if it does not exist
	def addIndexIfNotExists(self, column_name):
		sql = 'CREATE INDEX IF NOT EXISTS ' + column_name + ' ON ' + self.table_name + ' (' + column_name + ')'
		self.db.execute(sql)

	# checks if the given table has an entry with data in that given column name	
	def tableHasEntryWithProperty(self, prop_name, prop):
		if prop_name not in self.getColumnNames():
			return False
		try:
			sql = "SELECT * FROM " + self.table_name + " WHERE " + prop_name + " = %s"
			self.db.execute(self.db.mogrify(sql, (prop,)))
		except:
			return False
		query = self.db.fetchall()
		return len(query) > 0

	# returns a random alphanumric character with size 20
	# used for generating randoms ids
	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	def generateUniqueIdForColumn(self, column_name, size = 20):
		unique_id = self.id_generator()
		while self.tableHasEntryWithProperty(column_name, unique_id):
			unique_id = self.id_generator(size = size)
		return unique_id

	# given a table, outputs the table as a dictionary 
	# sorts the table by timestamp if it is a column
	def tableToDict(self, limit = None):
		keys = self.getColumnNames()
		if "time_stamp" in keys:
			sql = "SELECT * FROM " + self.table_name + " ORDER BY time_stamp"
		else:
			sql = "SELECT * FROM " + self.table_name
		if limit != None:
			sql = sql + " LIMIT " + str(self.query_limit)
		self.db.execute(sql)
		query = self.db.fetchall()
		output_list = list()
		for row in query:
			output = {}
			for i in range(0, len(keys)):
				output[keys[i]] = row[i]
			output_list.append(output)
		return output_list

	# return true if a table has a given column
	# false otherwise
	def tableHasColumn(self, column_name):
		colnames = self.getColumnNames()
		return column_name in colnames

	# inserts a dictionary into the table
	# if the one of the inputs keys is not in the table column
	# then we throw an exception
	def insertDictIntoTable(self, dictionary):
		sql = "INSERT INTO " + self.table_name + " ("
		# add the 
		keys = self.getColumnNames()
		value_list = list()
		for key in dictionary.keys():
			if key not in keys:
				raise Exception("Input key \'" + key  + "\' is not a column in \'" + self.table_name + "\'")
			else:
				sql = sql + key + ", "
		sql = sql[0:len(sql) - 2]
		sql = sql + ") VALUES ("
		for key in dictionary.keys():
			value_list.append(dictionary.get(key))
			sql = sql + "%s, "
		sql = sql[0:len(sql) - 2]
		sql = sql + ")"
		value_tup = tuple(value_list)
		mogrified_sql = self.db.mogrify(sql, value_tup)
		self.db.execute(mogrified_sql)

	# returns the data type of data in string form for 
	# as the data type we want in the sql database
	# for example if data = True
	# will return "BOOL"
	# if our case work doesn't find it defaults to TEXT
	def getDataTypeString(self, data):
		if data == None:
			return None
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

	# returns false if the key occurs more than once
	def isKeyUnique(self, key_name, key):
		matching_rows = self.getRowsByProperty(key_name, key)
		return len(matching_rows) == 1 or len(matching_rows) == 0
			
	#  given the table name, updates the entries that data property in the column property_column_name
	#  such that their entries in the column target_column_name have value data
	#  this property is not necessarily unique!
	def updateRowsByProperty(self, prop_name, prop, target_column_name, data):	
		# should we add a column if it does not exist, or just not ignore these columns
		# decided to throw an exception if the colum doesn't exist
		if not self.tableHasColumn(target_column_name):
			raise Exception("Trying to insert a new column into table : " + self.table_name)
		sql = "UPDATE " + self.table_name + " SET " + target_column_name + " = %s " + " WHERE " + prop_name + " = %s"
		mogrified_sql = self.db.mogrify(sql, (data, prop))
		self.db.execute(mogrified_sql)

	#  given the table name, updates the entries that data property in the column property_column_name
	#  such that their entries in the column target_column_name have value data
	def updateRowByKey(self, key_name, key, target_column_name, data):	
		if not self.isKeyUnique(key_name, key):
			raise Exception("In column \'" + key_name + "\', key \'" + key  + "\'' is not unique!")
		# should we add a column if it does not exist, or just not ignore these columns
		# decided to throw an exception if the colum doesn't exist
		if not self.tableHasColumn(target_column_name):
			raise Exception("Trying to insert a new column into table : " + self.table_name)
		sql = "UPDATE " + self.table_name + " SET " + target_column_name + " = %s " + " WHERE " + key_name + " = %s"
		mogrified_sql = self.db.mogrify(sql, (data, key))
		self.db.execute(mogrified_sql)

	# returns the rows with a certain property 
	# returns an empty list of nothing
	def getRowsByProperty(self, prop_name, prop):
		sql = "SELECT * FROM " + self.table_name + " WHERE " + prop_name + " = %s"
		mogrified_sql = self.db.mogrify(sql, (prop,))
		self.db.execute(mogrified_sql)
		query = self.db.fetchall()
		output_list = list()
		col_names = self.getColumnNames()
		for row in query:
			output = {}
			for i in range(0, len(col_names)):
				output[col_names[i]] = row[i]
			output_list.append(output)
		return output_list

	# updates a row with a certain key
	# for every key,value in the victionary if it is in the table
	# note, the key must be unique!
	# we throw an exception if it is not
	def updateEntireRowByKey(self, key_name, key, dictionary):
		if not self.isKeyUnique(key_name, key):
			raise Exception("In column \'" + key_name + "\', key \'" + key  + "\'' is not unique!")
		sql = "UPDATE " + self.table_name + " SET "
		table_columns = self.getColumnNames()
		value_list = list()
		for col_name in dictionary.keys():
			# might need to make this check not case sensitive
			if col_name in table_columns:
				sql = sql + col_name + " = %s, " 
				value_list.append(dictionary.get(col_name))
		# done to get rid of the ', ' at the end
		sql = sql[0: len(sql) - 2]
		sql = sql + " WHERE " + key_name  + " = %s" 
		value_list.append(key)
		value_tup = tuple(value_list)
		mogrified_sql = self.db.mogrify(sql, (value_tup))
		self.db.execute(mogrified_sql)



	# adds a column to a given table if it does not already exist
	def addColumnToTableIfNotExists(self, column_name, data_type = None):
		if self.tableHasColumn(column_name):
			return
		if data_type == None:
			data_type = "TEXT"
		sql = "ALTER TABLE " + self.table_name + " ADD " + column_name + " " + data_type
		self.db.execute(self.db.mogrify(sql))

	# returns the list of columns in a table given its name
	def getColumnNames(self):
		sql = "Select * FROM " + self.table_name + " LIMIT 0"
		self.db.execute(sql)
		colnames = self.db.fetchall()
		colnames = [desc[0] for desc in self.db.description]
		return colnames

	# deletes rows from a table by a property
	def deleteRowsFromTableByProperty(self, prop_name, prop):
		sql = "DELETE FROM " + self.table_name + " WHERE " + prop_name + " = %s"
		mogrified_sql = self.db.mogrify(sql, (prop,))
		self.db.execute(mogrified_sql)

	## returns a single row from a table given a unique property 
	## returns the row as a dictionary
	def getRowByKey(self, key_name, key):
		try:
			sql = "SELECT * FROM " + self.table_name + " WHERE " + key_name + " = %s"
			mogrified_sql = self.db.mogrify(sql, (key,))
			self.db.execute(mogrified_sql)
		except:
			return None
		query = self.db.fetchall()
		## return none if no matches
		if len(query) == 0:
			return None
		if len(query) > 1:
			raise Exception('Client tried to search by a property that was not unique! This method is only for unique property search')
			return
		row = query[0]
		output = {}
		keys = self.getColumnNames()
		for i in range(0, len(keys)):
			output[keys[i]] = row[i]
		return output

	def writeTableToXls(self):
		sql = "SELECT * FROM " + self.table_name
		self.db.execute(sql)
		if self.db.rowcount == 0:
			return 
		query = self.db.fetchall()
		wb = openpyxl.Workbook()
		ws = wb.active
		# Rows can also be appended
		headers = self.getColumnNames()
		ws.append(headers)
		for row in query:
			ws.append(row)
		# Save the file
		wb.save("./web/output/sql_tables/" + self.table_name + ".xlsx")

	# takes a file name which is the name of the output file
	def writeDictToXls(self, file_name, dictionary_list):
		if len(dictionary_list) == 0:
			return
		wb = openpyxl.Workbook()
		ws = wb.active
		# Rows can also be appended
		headers = list(dictionary_list[0].keys())
		headers.reverse()
		ws.append(headers)
		for item in dictionary_list:
			this_row = list()
			for key in headers:
				this_row.append(item[key])
			ws.append(this_row)
		# Save the file
		wb.save("./web/output/sql_tables/" + file_name + ".xlsx")

	# this method is just for testing, should almost never be used
	# but it deletes all columns in the table
	# then deletes the table
	def clearTable(self):
		try:
			sql = "DELETE FROM " + self.table_name
			self.db.execute(self.db.mogrify(sql))
			col_names = self.getColumnNames()
			for col_name in col_names:
				sql = "ALTER TABLE " + self.table_name + " DROP COLUMN " + col_name
				self.db.execute(self.db.mogrify(sql))
			sql = "DROP TABLE " + self.table_name
			self.db.execute(sql)
		except:
			print("table " + self.table_name + " does not exist")
		self.createTableIfNotExists()

	# returns the number of rows in the table
	def getNumRows(self):
		sql = "SELECT COUNT(*) FROM " + self.table_name
		self.db.execute(self.db.mogrify(sql))
		num_rows = self.db.fetchone()
		return num_rows[0]
		