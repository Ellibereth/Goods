import unittest
from unittest.mock import MagicMock
import string
import random
import time
from api.utility.account_manager import AccountManager
from api.utility.table_names import TestTables



Success = "success"
Email = "email"
Password = "password"
PasswordConfirm = "password_confirm"
Name = "name"
EmailConfirmationId = "email_confirmation_id"
EmailConfirmed = "email_confirmed"


# this user will not be randomly generated
in_user = {
				Name : "bob",
				Email : "spallstar28@gmail.com",
				Password : "bobbob",
				PasswordConfirm : "bobbob"
			}

class TestAccountManager(unittest.TestCase):

	def setUp(self):		
		self.sql = AccountManager(TestTables.UserInfoTable)
		self.entry_length = 5
		self.col_names = [Name, Email, Password]
		self.input_vars = [Name, Email, Password]
		self.col_names.append('time_stamp')
		self.num_rows = 1
		self.initializeTestTable()

	def tearDown(self):
		self.sql.closeConnection()

	def getDefensiveCopyOfInUser(self):
		test_user = {}
		for key in in_user.keys():
			test_user[key] = in_user[key]
		return test_user

	# we genrate a random dictionary to insert into the table
	def generateRandomUser(self):
		random_user = {}
		for key in self.input_vars:
			random_user[key] = self.sql.generateUniqueIdForColumn(key, self.entry_length)
		random_user[EmailConfirmed] = False	
		random_user['time_stamp'] = time.time()
		return random_user

	# initializes a random table 
	def initializeTestTable(self):
		self.sql.clearTable()
		self.sql.isUserSubmissionValid = MagicMock(return_value = 
			{Success: True, EmailConfirmationId : self.sql.generateUniqueIdForColumn(EmailConfirmationId)})
		self.sql.createUserInfoTable()
		for i in range(0, self.num_rows):
			random_user = self.generateRandomUser()
			self.sql.addUser(random_user)

		expected_num_rows = self.sql.getNumRows()
		self.sql.closeConnection()
		self.sql = AccountManager(TestTables.UserInfoTable)
		return (expected_num_rows == self.num_rows)

	# makes sure initialization works
	# the at First is to make sure this method gets run in the beginning 
	# because unit tests are ordered alphabetically 
	# to get around this I could initialize a new table everytime
	def testAtFirstInitializeTestTable(self):
		self.assertTrue(self.initializeTestTable())

	# tests get user and add user 
	def testAddAndGetUser(self):
		self.assertTrue(self.sql.getUserInfoFromEmail(in_user[Email]) == None)
		self.sql.isUserSubmissionValid = MagicMock(return_value = 
				{Success: True, EmailConfirmationId : self.sql.generateUniqueIdForColumn(EmailConfirmationId)}
			)
		# add a user to the list
		old_size = self.sql.getNumRows()
		self.sql.addUser(self.getDefensiveCopyOfInUser())
		new_size = self.sql.getNumRows()
		self.assertEqual(new_size, old_size + 1)
		out_user = self.sql.getUserInfoFromEmail(in_user[Email])
		self.assertEqual(in_user[Email], out_user[Email])
		self.assertEqual(in_user[Name], out_user[Name])


	# we need to add a bunch of bad inputs and see what happens :3 
	# 1. passwords match
	# 2. password is at least 6 characters
	# 3. email is a string (not sure why this wouldn't happen but it's there anyways)
	# 4. Email doesn't already exists
	# 5. If the email address is real (based on smtplib email)
	def testIsUserSubmissionValid(self):
		# make a defensive copy
		test_user = self.getDefensiveCopyOfInUser()
		good_password = "bromigo555"
		short_password = "bro"
		good_email = "bro@gmail.com"
		bad_email = "brovogre"
		invalid_email = False

		# a good submision
		# print("test_user : " +str(test_user))
		print(self.sql.isUserSubmissionValid(test_user))
		self.assertTrue(self.sql.isUserSubmissionValid(test_user)[Success])

		# password mismatch
		test_user = self.getDefensiveCopyOfInUser()
		test_user[PasswordConfirm] = test_user[Password] + "ANYTHING"
		self.assertFalse(self.sql.isUserSubmissionValid(test_user)[Success])

		# password is less than 6 characters
		test_user = self.getDefensiveCopyOfInUser()
		test_user[Password] = short_password
		test_user[PasswordConfirm] = short_password
		self.assertFalse(self.sql.isUserSubmissionValid(test_user)[Success])

		# email is invalid data type
		test_user = self.getDefensiveCopyOfInUser()
		test_user[Email] = invalid_email
		self.assertFalse(self.sql.isUserSubmissionValid(test_user)[Success])

		# email already exists
		self.sql.addUser(self.getDefensiveCopyOfInUser())
		test_user = self.getDefensiveCopyOfInUser()
		self.assertFalse(self.sql.isUserSubmissionValid(test_user)[Success])

		# email is invalid format 
		test_user = self.getDefensiveCopyOfInUser()
		test_user[Email] = bad_email
		self.assertFalse(self.sql.isUserSubmissionValid(test_user)[Success])
		
	# login info is a dictionary where the fields are user Email and Password
	def testCheckLogin(self):
		test_user = self.getDefensiveCopyOfInUser()
		self.sql.addUser(test_user)
		login_info = {Email : in_user[Email], Password : in_user[Password]}
		output = self.sql.checkLogin(login_info)
		self.assertTrue(output[Success])
		bad_login_info= {Email : in_user[Email], Password : "something that is certainly not his password"}
		output = self.sql.checkLogin(bad_login_info)
		self.assertFalse(output[Success])
		
	def testTableHasConfirmationId(self):
		self.sql.generateEmailConfirmationId = MagicMock(return_value = "CONFIRM")
		# this should not come up from initialization
		# since they are to be length 20 
		self.assertFalse(self.sql.tableHasConfirmationId("CONFIRM"))
		self.sql.addUser(in_user)
		self.assertTrue(self.sql.tableHasConfirmationId("CONFIRM"))

	# returns true if the email is in the table
	def testTableHasEmail(self):
		self.assertFalse(self.sql.tableHasEmail(in_user[Email]))
		self.sql.addUser(in_user)
		self.assertTrue(self.sql.tableHasEmail(in_user[Email]))

	# returns true if the email is confirmed
	# returns false if the email is not confirmed or does not exists
	def testIsEmailConfirmed(self):
		self.assertFalse(self.sql.isEmailConfirmed(in_user[Email]))
		self.sql.addUser(in_user)
		self.assertFalse(self.sql.isEmailConfirmed(in_user[Email]))
		self.sql.updateRowByKey(Email, in_user[Email], EmailConfirmed, True)
		self.assertTrue(self.sql.isEmailConfirmed(in_user[Email]))
		
	# sets the EmailConfirmed column to true for this e-mail
	def testConfirmEmail(self):
		self.sql.addUser(in_user)
		self.assertFalse(self.sql.isEmailConfirmed(in_user[Email]))
		out_user = self.sql.getUserInfoFromEmail(in_user[Email])
		self.sql.confirmEmail(out_user[EmailConfirmationId])
		self.assertTrue(self.sql.isEmailConfirmed(in_user[Email]))


		
