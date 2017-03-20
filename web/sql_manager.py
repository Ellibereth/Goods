import time
import string
import random
import time
import psycopg2
import openpyxl
from credentials import credential
						 

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

	def closeConnection(self):
		self.db.close()
		self.p_db.close()

	# creates a new table with columns submission_id and time_stamp
	def createNewTableIfNotExists(self):
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.table_name + ' (time_stamp FLOAT)'
		self.db.execute(createTableCode)		

	# checks if the given table has an entry with data in that given column name	
	def tableHasEntryWithProperty(self, column_name, entry_data):
		try:
			sql = "SELECT * FROM " + self.table_name + " WHERE " + column_name + " = %s"
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
	# sorts the table by timestamp if it is a column
	def tableToDict(self):
		keys = self.getColumnNames()
		if "time_stamp" in keys:
			sql = "SELECT * FROM " + self.table_name + " ORDER BY time_stamp"
		else:
			sql = "SELECT * FROM " + self.table_name
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
	def insertIntoTableWithInitialValue(self, initial_column_name, initial_value):
		sql = "INSERT INTO " + self.table_name + " (" + initial_column_name + ") VALUES (%s)"
		mogrified_sql = self.db.mogrify(sql, (initial_value,))
		self.db.execute(mogrified_sql)

	#  given the table name, updates the entries that data key in the column key_column_name
	#  such that their entries in the column target_column_name have value data
	#  if target_column_name doesn't exists, it creates it with value 
	# this key is not necessarily unique!
	def updateEntryByKey(self, key_column_name, key, target_column_name, data):	
		if not self.tableHasColumn(target_column_name):
			data_type = self.getDataTypeString(data)
			self.addColumnToTableIfNotExists(target_column_name, data_type = data_type)
		sql = "UPDATE " + self.table_name + " SET " + target_column_name + " = %s " + " WHERE " + key_column_name + " = %s"
		mogrified_sql = self.db.mogrify(sql, (data, key))
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
		sql = "Select * FROM " + self.table_name
		self.db.execute(sql)
		colnames = self.db.fetchall()
		colnames = [desc[0] for desc in self.db.description]
		return colnames

	# deletes a row from a table by submission_id
	def deleteRowFromTableByProperty(self, column_name, value):
		sql = "DELETE FROM " + self.table_name + " WHERE " + column_name + " = %s"
		mogrified_sql = self.db.mogrify(sql, (value,))
		self.db.execute(mogrified_sql)

	## returns a single row from a table given a unique property 
	## returns the row as a dictionary
	def getRowByUniqueProperty(self, column_name, value):
		try:
			sql = "SELECT * FROM " + self.table_name + " WHERE " + column_name + " = %s"
			mogrified_sql = self.db.mogrify(sql, (value,))
			self.db.execute(mogrified_sql)
		except:
			return None
		query = self.db.fetchall()
		if len(query) > 1:
			raise Exception('Client tried to search by a property that was not unique! This method is only for unique property search')
			return
		row = query[0]
		output = {}
		keys = self.getColumnNames()
		for i in range(0, len(keys)):
			output[keys[i]] = row[i]
		return output

	def writeTableToCsv(self):
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
	def writeDictToCsv(self, file_name, dictionary_list):
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
