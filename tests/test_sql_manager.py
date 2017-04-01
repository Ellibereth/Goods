import unittest
from unittest.mock import MagicMock

import string
import random
import time
from api.utility.sql_manager import SqlManager
from api.utility.table_names import TestTables

ROW_NUMBER = "row_number"
TWICE_ROW_NUMBER = "twice_row_number"
A = "a"
B = "b"
C = "c"
INTEGER = "INTEGER"
FLOAT = "FLOAT"
BOOL = "BOOL"
TEXT = "TEXT"

class TestSqlManager(unittest.TestCase):

	def setUp(self):		
		self.sql = SqlManager(TestTables.SqlTestTable)
		self.num_columns = 20
		self.entry_length = 5
		self.col_names = [A, B, B]
		self.col_names.append('time_stamp')
		self.col_names.append(ROW_NUMBER)
		self.col_names.append(TWICE_ROW_NUMBER)
		self.num_rows = 4
		self.initializeTestTable()

	def tearDown(self):
		self.sql.closeConnection()

	# we genrate a random dictionary to insert into the table
	def generateRandomDict(self):
		random_dict = {}
		for key in self.col_names:
			random_dict[key] = self.sql.generateUniqueIdForColumn(key, self.entry_length)
		random_dict[ROW_NUMBER] = self.sql.getNumRows() + 1
		random_dict[TWICE_ROW_NUMBER] = random_dict[ROW_NUMBER] * 2
		random_dict['time_stamp'] = time.time()
		return random_dict

	# initializes a random table 
	def initializeTestTable(self):
		self.sql.clearTable()
		self.data_list = list()
		self.sql.addColumnToTableIfNotExists('time_stamp', 'FLOAT')
		self.sql.addColumnToTableIfNotExists(ROW_NUMBER, 'INTEGER')
		self.sql.addColumnToTableIfNotExists(TWICE_ROW_NUMBER, 'INTEGER')
		for col in self.col_names:
			self.sql.addColumnToTableIfNotExists(col)
		for i in range(0, self.num_rows):
			random_dict = self.generateRandomDict()
			self.sql.insertDictIntoTable(random_dict)

		expected_num_rows = self.sql.getNumRows()
		return (expected_num_rows == self.num_rows)

	# makes sure initialization works
	# the at First is to make sure this method gets run in the beginning 
	# because unit tests are ordered alphabetically 
	# to get around this I could initialize a new table everytime
	def testAtFirstInitializeTestTable(self):
		self.assertTrue(self.initializeTestTable())

	# should show a table of size 0 if the table is empty 
	def testClearTable(self):
		self.sql.clearTable()		
		self.assertTrue(self.sql.getNumRows() == 0)
		self.initializeTestTable()

	# tests if the size of the id generated is correct
	def testIdGenerator(self):
		# this can be an argument somewhere else, just not sure where yet
		num_tests = 10
		for i in range(0, num_tests):
			random_size = random.randint(1, 10)
			new_id = self.sql.id_generator(size = random_size)
			self.assertEqual(len(new_id), random_size)
 
 	# generates a bunch of unit ids, and will ensure they are not already 
 	# in the database 
	def testGenerateUniqueIdForColumn(self):
		num_tests = 10
		test_row = self.sql.getRowByKey(ROW_NUMBER , 1)
		existingId = test_row[A]
		testId = "$#BCDE"
		
		# we arbitrarily test on col a
		for i in range(0, num_tests):
			self.sql.id_generator = MagicMock(side_effect = [existingId, testId])
			new_id = self.sql.generateUniqueIdForColumn(A, size = self.entry_length)
			self.assertEqual(new_id, testId)

	def testGetRowByKey(self):
		# test for a row we know exists
		row_number = 2
		this_row  = self.sql.getRowByKey(ROW_NUMBER, row_number)
		self.assertTrue(this_row != None)
		self.assertEqual(this_row[TWICE_ROW_NUMBER], 2 * row_number)
		# test for a row we know does not exist
		fake_row = self.sql.getRowByKey(ROW_NUMBER, -1)
		self.assertTrue(fake_row == None)

	## tests following method
	# insertDictIntoTabe
	def testInsertDictIntoTable(self):
		# self.initializeTestTable()
		old_num_rows = self.sql.getNumRows()
		random_dict = self.generateRandomDict()
		self.sql.insertDictIntoTable(random_dict)
		new_num_rows = self.sql.getNumRows()
		# make sure there actually is another row
		self.assertTrue(new_num_rows, old_num_rows + 1)
		# make sure we can find it
		just_added_row = self.sql.getRowByKey(ROW_NUMBER, new_num_rows)
		self.assertTrue(just_added_row != None)
		self.assertEqual(just_added_row[ROW_NUMBER], new_num_rows)

	def testDeleteRowsFromTableByProperty(self):
		old_num_rows = self.sql.getNumRows()
		# assert existence before deletion
		before_deletion_row = self.sql.getRowByKey(ROW_NUMBER, old_num_rows)
		self.assertTrue(before_deletion_row != None)
		# delete the row and check the size of table
		self.sql.deleteRowsFromTableByProperty(ROW_NUMBER, old_num_rows)
		self.assertEqual(old_num_rows - 1, self.sql.getNumRows())

		# assert this row is gone
		just_deleted_row = self.sql.getRowByKey(ROW_NUMBER, old_num_rows)
		self.assertTrue(just_deleted_row == None)

	def testGetDataTypeString(self):
		self.assertEqual(self.sql.getDataTypeString(None), None)
		self.assertEqual(self.sql.getDataTypeString(1), INTEGER)
		self.assertEqual(self.sql.getDataTypeString(-1), INTEGER)
		self.assertEqual(self.sql.getDataTypeString(0), INTEGER)
		self.assertEqual(self.sql.getDataTypeString(1.5), FLOAT)
		self.assertEqual(self.sql.getDataTypeString(-0.5), FLOAT)
		self.assertEqual(self.sql.getDataTypeString("test_string"), TEXT)
		self.assertEqual(self.sql.getDataTypeString(""), TEXT)
		self.assertEqual(self.sql.getDataTypeString(True), BOOL)
		self.assertEqual(self.sql.getDataTypeString(list()), None)
		self.assertEqual(self.sql.getDataTypeString(dict()), None)

	def testTableHasColumn(self):
		self.assertTrue(self.sql.tableHasColumn(A))
		self.assertTrue(self.sql.tableHasColumn("b"))
		self.assertTrue(self.sql.tableHasColumn("time_stamp"))
		self.assertTrue(self.sql.tableHasColumn(ROW_NUMBER))
		self.assertTrue(self.sql.tableHasColumn(TWICE_ROW_NUMBER))
		self.assertFalse(self.sql.tableHasColumn("bad_table_name_AJDJFJDFJA"))
		self.assertFalse(self.sql.tableHasColumn(""))

	def testTableHasEntryWithProperty(self):
		# there should always be one with the value 1, only is 1 if table is empty
		self.assertTrue(self.sql.tableHasEntryWithProperty(ROW_NUMBER, 1))
		self.assertFalse(self.sql.tableHasEntryWithProperty("BAD_TABLE_NAME_*$", "bad _data"))
		self.assertFalse(self.sql.tableHasEntryWithProperty(ROW_NUMBER, -1))


	def testTableToDict(self):
		dict_from_table = self.sql.tableToDict()
		self.assertEqual(self.sql.getNumRows(), len(dict_from_table))
		self.assertEqual(self.sql.getNumRows(), len(dict_from_table))
		for i in range(0, self.sql.getNumRows()):
			self.assertEqual(dict_from_table[i][ROW_NUMBER], (i+1))
			self.assertEqual(dict_from_table[i][TWICE_ROW_NUMBER], 2*(i+1))

	# this method tests two methods
	# getRowsByProperty
	# updateEntryByProperty
	def testUpdateAndGetRowsByProperty(self):
		# nothing should have the TEST_ENTRY value since they are 
		# initialized to length 5
		# this guarantees we start with nothing
		TEST_STRING = "TEST_ENTRY"
		self.assertEqual(len(self.sql.getRowsByProperty(A, TEST_STRING)), 0)
		num_rows = self.sql.getNumRows()
		# asserts row exists
		row_to_update = self.sql.getRowByKey(ROW_NUMBER, num_rows)
		self.assertTrue(row_to_update != None)

		# update and assert that the number of rows with property has increased
		self.sql.updateRowsByProperty(ROW_NUMBER, num_rows, A, TEST_STRING)
		self.assertEqual(len(self.sql.getRowsByProperty(A, TEST_STRING)), 1)
		updated_row = self.sql.getRowByKey(ROW_NUMBER, num_rows)
		self.assertEqual(updated_row[A], TEST_STRING)

		# do the same for another one
		self.sql.updateRowsByProperty(ROW_NUMBER, num_rows - 1, A, TEST_STRING)
		self.assertEqual(len(self.sql.getRowsByProperty(A, TEST_STRING)), 2)
		updated_row = self.sql.getRowByKey(ROW_NUMBER, num_rows - 1)
		self.assertEqual(updated_row[A], TEST_STRING)

		# reset them back to something nomral
		self.sql.updateRowsByProperty(A, TEST_STRING, A, self.sql.generateUniqueIdForColumn(A, self.entry_length))
		self.assertEqual(len(self.sql.getRowsByProperty(A, TEST_STRING)), 0)

	# def testUpdateRowByUniqueKey_UpdateWithUniqueKey(self):
	# def testUpdateRowByUniqueKey_UpdateWithDuplicateKeys(self):


