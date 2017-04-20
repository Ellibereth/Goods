from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from passlib.hash import argon2
from api.models.shared_models import db
import time
import random
import string
from api.utility import email_api
from api.utility.stripe_api import StripeManager
from api.utility.labels import UserLabels as Labels
from api.utility.id_util import IdUtil
from api.utility.lob import Lob


## I understand there are magic strings in this, but not sure the best way to get around it right now
## it's mostly an issue in the updateSettings which takes a dictionary as input, but we'll see

MIN_PASSWORD_LENGTH = 6

## user object class
class User(db.Model):
	__tablename__ = ProdTables.UserInfoTable
	account_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
	email = db.Column(db.String, unique = True, nullable = False)
	email_confirmation_id = db.Column(db.String, unique = True, nullable = False)
	email_confirmed = db.Column(db.Boolean)
	password_hash = db.Column(db.String, nullable = False)
	name = db.Column(db.String, nullable = False)
	stripe_customer_id = db.Column(db.String, unique = True)
	is_admin = db.Column(db.Boolean, default = False)
	soft_deleted = db.Column(db.Boolean, default = False)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, name, email, password, email_confirmation_id):
		self.name = name
		self.email = email
		self.password_hash = User.argonHash(password)
		self.email_confirmation_id = email_confirmation_id
		self.email_confirmed = False
		db.Model.__init__(self)
		
	@staticmethod
	def argonHash(pre_hash):
		return argon2.using(rounds=4).hash(pre_hash)

	@staticmethod
	def argonCheck(pre_hash, post_hash):
		return argon2.verify(pre_hash, post_hash)

	@staticmethod
	def generateEmailConfirmationId():
		new_confirmation_id = IdUtil.id_generator()
		missing = User.query.filter_by(email_confirmation_id = new_confirmation_id).first()
		while missing is not None:
			new_confirmation_id = IdUtil.id_generator()
			missing = User.query.filter_by(email_confirmation_id = new_confirmation_id).first()
		return new_confirmation_id

	
	# right now this method only checks if the password is at least 6 characters
	# but we'll add other stuff too
	# this will be used when user's are typing in their inputs on the screen too
	@staticmethod
	def validatePasswordSubimssion(password):
		if len(password) < MIN_PASSWORD_LENGTH:
			return {Labels.Success: False, Labels.Error : "Password must be at least " + str(MIN_PASSWORD_LENGTH) + " characters"}
		return {Labels.Success: True}

	# WIP
	@staticmethod
	def validateEmailSubmission(email):
		return {Labels.Success: True}

	def toPublicDict(self):
		public_dict = {}
		public_dict['name'] = self.name
		public_dict['email'] = self.email
		public_dict['email_confirmed'] = self.email_confirmed
		public_dict['account_id'] = self.account_id
		public_dict['is_admin'] = self.is_admin
		return public_dict

	# do you think these methods should be static or instance?
	# here is an example implementation for static 
	@staticmethod
	def confirmEmailStatic(email_confirmation_id):
		user = User.query.filter_by(email_confirmation_id = email_confirmation_id).first()
		if user == None:
			return None
		else:
			user.email_confirmed = True
		db.session.commit()

	# here is an instance implementation of this method
	# it doesn't need the confirmation id because that is used to get the user
	def confirmEmail(self):
		self.email_confirmed = True
		db.session.commit()

	# checks if the input password matches the argon hash
	# return true if they do match
	# returns false if they do not
	def checkLogin(self, input_password):
		return User.argonCheck(input_password, self.password_hash)

	# changes the password of the user
	# returns True if old password is correct
	# return False if not
	def changePassword(self, old_password, new_password):
		if self.checkLogin(old_password):
			self.password_hash = User.argonHash(new_password)
			db.session.commit()
			return True
		else:
			return False

	# new settings is a dictionary object
	# this part is slightly hard coded :P
	def updateSettings(self, new_settings):
		for key in new_settings.keys():
			if key == Labels.Name:
				self.name = new_settings[Labels.Name]
			elif key == Labels.Email:
				self.email = new_settings[Labels.Email]
			else:
				raise Exception("Invalid setting submission!")
		db.session.commit()

	# adds a credit card with billing and shipping information to stripe 
	def addCreditCard(self, address_city, address_line1, address_line2, address_zip,
			exp_month, exp_year, number, cvc, name, address_country = "US"):
		card = StripeManager.addCardForCustomer(user, address_city, address_line1, address_line2, 
			address_zip, exp_month, exp_year, number, cvc, name, address_country = "US")
		return card
		

	def getCreditCards(self):
		return StripeManager.getUserCards(self)

	def addAddress(self, description, name, address_line1, address_line2, address_city, address_state,
			address_zip, address_country):

		address = Lob.addUserAddress(self, description = description, name = name, address_line1 = address_line1
			, address_line2 = address_line2, address_city = address_city,
				address_state = address_state, address_zip = address_zip,
				 address_country = address_country)
		return address
		
	def getAddresses(self):
		addresses = Lob.getUserAddresses(self)
		return addresses

	# in actuality this method deletes the previous address with the id and then recreates one
	def editAddress(self, address_id, description, name, address_line1, address_line2, address_city, address_state,
			address_zip, address_country):

		Lob.deleteAddress(address_id)
		address = Lob.addUserAddress(self, description = description, name = name, address_line1 = address_line1
			, address_line2 = address_line2, address_city = address_city,
				address_state = address_state, address_zip = address_zip,
				 address_country = address_country)
		return address


	def deleteAddress(self, address_id):
		Lob.deleteAddress(address_id)

	def deleteCreditCard(self, card_id):
		StripeManager.deleteCreditCard(self, card_id)








