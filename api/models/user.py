from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from passlib.hash import argon2
from api.models.shared_models import db
import time
import datetime
import random
import string
from api.utility.stripe_api import StripeManager
from api.utility.labels import UserLabels as Labels
from api.utility.id_util import IdUtil
from api.utility.lob import Lob
from api.models.order import OrderItem
from api.models.order import Order
from api.models.cart import Cart
from api.models.market_product import MarketProduct
import re




## I understand there are magic strings in this, but not sure the best way to get around it right now
## it's mostly an issue in the updateSettings which takes a dictionary as input, but we'll see

MIN_PASSWORD_LENGTH = 6

## user object class
class User(db.Model):
	__tablename__ = ProdTables.UserInfoTable
	account_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
	email = db.Column(db.String, unique = True)
	email_confirmation_id = db.Column(db.String, unique = True, nullable = False)
	email_confirmed = db.Column(db.Boolean, default = False)
	password_hash = db.Column(db.String, nullable = False)
	name = db.Column(db.String, nullable = False)
	stripe_customer_id = db.Column(db.String, unique = True)
	soft_deleted = db.Column(db.Boolean, default = False)
	default_address = db.Column(db.String)
	default_card = db.Column(db.String)
	deleted_account_email = db.Column(db.String)
	recovery_pin = db.Column(db.String)
	recovery_pin_expiration = db.Column(db.DateTime)
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


	@staticmethod
	def generateRecoveryPin():
		new_recovery_pin = IdUtil.id_generator()
		missing = User.query.filter_by(recovery_pin = new_recovery_pin).first()
		while missing is not None:
			new_recovery_pin = IdUtil.id_generator()
			missing = User.query.filter_by(recovery_pin = new_recovery_pin).first()
		return new_recovery_pin

	
	# right now this method only checks if the password is at least 6 characters
	# but we'll add other stuff too
	# this will be used when user's are typing in their inputs on the screen too
	@staticmethod
	def validatePasswordSubimssion(password):
		if len(password) < MIN_PASSWORD_LENGTH:
			return {Labels.Success: False, Labels.Error : "Password must be at least " + str(MIN_PASSWORD_LENGTH) + " characters"}
		return {Labels.Success: True}

	@staticmethod
	def isValidEmail(email):
		if len(email) > 7:
			if re.match("[^@]+@[^@]+\.[^@]+", email) != None:
				return True
		return False

	def toJwtDict(self):
		public_dict = {}
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Email] = self.email
		public_dict[Labels.EmailConfirmed] = self.email_confirmed
		public_dict[Labels.AccountId] = self.account_id
		return public_dict


	def toPublicDictFast(self):
		public_dict = {}
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Email] = self.email
		public_dict[Labels.EmailConfirmed] = self.email_confirmed
		public_dict[Labels.AccountId] = self.account_id
		public_dict[Labels.CartSize] = Cart(self.account_id).getCartSize()
		public_dict[Labels.Cart] = Cart(self.account_id).toPublicDict()
		public_dict[Labels.Addresses] = []
		public_dict[Labels.Cards] = []
		return public_dict


	def toPublicDictCheckout(self, address):
		public_dict = {}
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Email] = self.email
		public_dict[Labels.EmailConfirmed] = self.email_confirmed
		public_dict[Labels.AccountId] = self.account_id
		public_dict[Labels.CartSize] = Cart(self.account_id).getCartSize()
		public_dict[Labels.Cart] = Cart(self.account_id).toPublicDict(address)
		public_dict[Labels.Addresses] = self.getAddresses()
		public_dict[Labels.Cards] = self.getCreditCards()
		public_dict[Labels.Orders] = self.getUserOrders()
		public_dict[Labels.DefaultCard] = self.default_card
		public_dict[Labels.DefaultAddress] = self.default_address
		return public_dict

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Email] = self.email
		public_dict[Labels.EmailConfirmed] = self.email_confirmed
		public_dict[Labels.AccountId] = self.account_id
		public_dict[Labels.CartSize] = Cart(self.account_id).getCartSize()
		public_dict[Labels.Cart] = Cart(self.account_id).toPublicDict()
		public_dict[Labels.Addresses] = self.getAddresses()
		public_dict[Labels.Cards] = self.getCreditCards()
		public_dict[Labels.Orders] = self.getUserOrders()
		public_dict[Labels.DefaultCard] = self.default_card
		public_dict[Labels.DefaultAddress] = self.default_address
		return public_dict

	def adjustCart(self):
		cart = Cart(self.account_id)
		adjusted_items = list()
		for cart_item in cart.items:
			this_product = MarketProduct.query.filter_by(product_id = cart_item.product_id).first()
			if cart_item.variant_type:
				this_variant = ProductVariant.query.filter_by(variant_id = cart_item.variant_id).first()
				if this_variant:
					new_inventory = this_variant.inventory - cart_item.num_items
					if new_inventory < 0:
						cart_item.num_items = this_variant.inventory
						adjusted_items.append({
							Labels.Name : this_product.name + " " + str(this_variant.variant_type),
							Labels.NumItems : this_variant.inventory
						})
			else:
				new_inventory = this_product.inventory - cart_item.num_items
				if new_inventory < 0:
					cart_item.num_items = this_product.inventory
					adjusted_items.append({
						Labels.Name : this_product.name,
						Labels.NumItems : this_product.inventory
					})

		db.session.commit()
		if not adjusted_items:
			return None
		else:
			return adjusted_items

	def setRecoveryPin(self):
		self.recovery_pin = self.generateRecoveryPin()
		self.recovery_pin_expiration = datetime.datetime.now() + datetime.timedelta(minutes = 15)
		db.session.commit()

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

	def setPasswordWithRecovery(self, password):
		self.password_hash = User.argonHash(password)
		self.recovery_pin = None
		self.recovery_pin_expiration = None
		db.session.commit()

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
			exp_month, exp_year, number, cvc, name, address_state, address_country = "US"):

		card = StripeManager.addCardForCustomer(self, address_city, address_line1, address_line2, 
			address_zip, exp_month, exp_year, number, cvc, name, address_state, address_country = "US")
		all_cards = self.getCreditCards()
		if len(all_cards) == 1:
			self.default_card = card['id']
			db.session.commit()
		return card
		

	def getCreditCards(self):
		try:
			cards = StripeManager.getUserCards(self)
			try:
				sorted_cards = sorted(cards,  key=lambda k: k['metadata'].get('date_created'))
				return sorted_cards
			except:
				return cards
		except Exception as e:
			return []

	def addAddress(self, description, name, address_line1, address_line2, address_city, address_state,
			address_zip, address_country):
		if description == None:
			description = ""
		address = Lob.addUserAddress(self, description = description, name = name, address_line1 = address_line1
			, address_line2 = address_line2, address_city = address_city,
				address_state = address_state, address_zip = address_zip,
				 address_country = address_country)
		all_addresses = self.getAddresses()
		if len(all_addresses) == 1:
			self.default_address = address['id']
			db.session.commit()
		return address
		
	def getAddresses(self):
		try:
			addresses = Lob.getUserAddresses(self)
			sorted_addresses = sorted(addresses,  key=lambda k: k['date_created'])
			# for address in sorted_addresses:
			# 	print(address['address_zip'])
			return sorted_addresses
		except:
			return []

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

	# get last N orders from user
	def getUserOrders(self, limit = 10):
		orders = list()
		for order in Order.query.filter_by(account_id = self.account_id).all():
			orders.append(Order.getOrderById(order.order_id).toPublicDict())

		sorted_orders = sorted(orders,  key=lambda k: k.get('date_created'))
		sorted_orders.reverse()
		return sorted_orders[:limit]


	# deletes the user and overwrites their email
	def softDeleteAccount(self):
		self.soft_deleted = True
		self.deleted_account_email = self.email
		self.email = None
		db.session.commit()

