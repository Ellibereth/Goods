from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import unittest
from flask_testing import TestCase
from api.models.shared_models import db

from api.models.user import User
from api.models.market_product import MarketProduct, ProductVariant
from api.models.cart import Cart, CartItem
from api.models.order import Order, OrderItem
from api.models.product_tag import ProductTag
import os
from base64 import b64encode
import random
from api.utility.checkout import Checkout



BLANK_INPUT = ""
NULL_INPUT = ""
WRONG_ZIP = "19131"
SHORT_CARD_NUMBER = "4242"
SHORT_EXPIRY = "1"
LONG_EXPIRY = "1234"
INVALID_EMAILS = ["spallstar28", "bro@bro.bro"]
BAD_PASSWORDS = ["bro", "!@#$$!&(#)", "\"\'\'\'\'\'\'\'\'\'"]
LONG_NAME = "bobobobobobobobobobobobobobobobobobobobobobobobobobobb"
TEXT_INPUT = "ASDF"



NAME = "SAMPLE Name"
EMAIL = "spallstar28@gmail.com"
PASSWORD = "password1"
PASSWORD_CONFIRM = PASSWORD
EMAIL_CONFIMRATION_ID = "QWERTU1234"
PRICE = 5.99
INVENTORY = 10
VARIANT_TYPE = "blue"

# these ones will be a valid set, soon will add an invalid set 
DESCRIPTION = "SAMPLE DESCRIPTION",
ADDRESS_NAME = "SAMPLE Name"
ADDRESS_LINE1 = "17769 Steading Rd"
ADDRESS_LINE2 = ""
ADDRESS_STATE = "MN"
ADDRESS_CITY = "Eden Prairie"
ADDRESS_COUNTRY = "US"
ADDRESS_ZIP = "55347"



CARD_NUMBER = "4242424242424242"
CARD_CVC = "123"
CARD_NAME = "Vladimir Kramnik"
CARD_EXP_MONTH =  "02"
CARD_EXP_YEAR =  "20"

AVAILABLE_INVENTORY = 5
UNAVAILABLE_INVENTORY = 15


TEST_INVENTORY = 2

class Labels:
	TotalPrice = "total_price"
	NumItems = "num_items"
	Success = "success"
	Error = "error"
	AccountId = "account_id"
	AddressId = "address_id"
	CardId = "card_id"
	Addresses = "addresses"
	Cards = "cards"
	Last4 = "last4"
	Id = "id"
	Items = "items"
	Variants = "variants"
	VariantType = "variant_type"
	AddressLine1 = "address_line1"
	Cart = "cart"
	VariantId = "variant_id"
	Order = "order"
	Orders = "orders"
	Name = "name"


class TestModels(TestCase):

	def create_app(self):
		secret_key = b64encode(b'L=\xbf=_\xa5P \xc5+\x9b3\xa4\xfdZ\x8fN\xc6\xd5\xb7/\x0f\xbe\x1b')
		secret_key = secret_key.decode('utf-8')
		
		os.environ['SECRET_KEY'] = secret_key
		app = Flask(__name__)
		SQLALCHEMY_DATABASE_URI = "postgresql://sjlekkgepnocjg:cbaa9888fd46d74bf9491ecacde5e24b52de0c7d74e4047cf0cbfc40136bc73f@ec2-107-21-108-204.compute-1.amazonaws.com:5432/d9p390sjrd817i"
		app.config['SECRET_KEY'] = secret_key
		app.config['TESTING'] = True
		app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
		app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
		db.init_app(app)
		return app

	def setUp(self):
		db.create_all()

	def tearDown(self):
		db.session.remove()
		db.drop_all()

	def add_user(self):
		response =  User.registerUser(NAME, EMAIL, PASSWORD, PASSWORD_CONFIRM)
		new_user = User.query.filter_by(email = EMAIL).first() 
		new_user.account_id = random.randint(100000, 200000)
		db.session.add(new_user)
		db.session.commit()
		return new_user

	def add_product_without_variants(self):
		new_product = MarketProduct(NAME)
		new_product.has_variants = False
		new_product.price = PRICE
		new_product.inventory = INVENTORY

		db.session.add(new_product)
		db.session.commit()
		return new_product

	def add_product_with_variants(self):
		new_product = MarketProduct(NAME)
		new_product.has_variants = True
		db.session.add(new_product)
		db.session.commit()
		new_product.addProductVariant(variant_type = VARIANT_TYPE, price = PRICE, inventory = INVENTORY)
		
		return new_product



	

	def add_item_without_variant_to_cart(self, new_user, quantity):
		new_product = self.add_product_without_variants()
		return new_user.addItemToCart(new_product.product_id, quantity, variant_id = None)

	def add_item_with_variant_to_cart(self, new_user, quantity):
		new_product = self.add_product_without_variants()
		return new_user.addItemToCart(new_product.product_id, quantity, variant_id = None)

	def add_user_address(self, new_user):
		new_address_response =  new_user.addAddress(DESCRIPTION, ADDRESS_NAME, ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_CITY, ADDRESS_STATE,
			ADDRESS_ZIP, ADDRESS_COUNTRY)
		return new_address_response

	def add_user_card(self, new_user):
		new_card_response = new_user.addCreditCard(ADDRESS_CITY, ADDRESS_LINE1, ADDRESS_LINE2, 
		ADDRESS_ZIP, CARD_EXP_MONTH, CARD_EXP_YEAR, CARD_NUMBER,
		 CARD_CVC, CARD_NAME, ADDRESS_STATE, ADDRESS_COUNTRY)
		return new_card_response

	def add_custom_address(self, user, description, name, line1, line2, city, state, zipcode, country):
		return user.addAddress(description, name, line1,
		 line2, city, state, zipcode, country)

	def add_custom_card(self, user, name, number, cvc, exp_month, exp_year):
		return user.addCreditCard(ADDRESS_CITY, ADDRESS_LINE1, ADDRESS_LINE2, 
			ADDRESS_ZIP, exp_month, exp_year, number,
			cvc, name, ADDRESS_STATE, ADDRESS_COUNTRY)


	def test_add_user(self):
		bad_user =  User.registerUser(BLANK_INPUT, EMAIL, PASSWORD, PASSWORD_CONFIRM)
		self.assertFalse(bad_user.get(Labels.Success))
		bad_user =  User.registerUser(NAME, BLANK_INPUT, PASSWORD, PASSWORD_CONFIRM)
		self.assertFalse(bad_user.get(Labels.Success))
		bad_user =  User.registerUser(NAME, EMAIL, BLANK_INPUT, PASSWORD_CONFIRM)
		self.assertFalse(bad_user.get(Labels.Success))
		bad_user =  User.registerUser(NAME, EMAIL, PASSWORD, BLANK_INPUT)
		self.assertFalse(bad_user.get(Labels.Success))
		bad_user =  User.registerUser(LONG_NAME, EMAIL, PASSWORD, PASSWORD_CONFIRM)
		self.assertFalse(bad_user.get(Labels.Success))

		new_user =  self.add_user()
		self.assertTrue(new_user in db.session)
		self.assertTrue(new_user.name == NAME)
		self.assertTrue(new_user.email == EMAIL)
		self.assertTrue(new_user.checkLogin(PASSWORD))


	def test_add_product(self):
		new_product = self.add_product_with_variants()
		self.assertTrue(new_product in db.session)
		self.assertTrue(new_product.has_variants)
		public_dict = new_product.toPublicDict()
		self.assertTrue(len(public_dict[Labels.Variants]) == 1)
		self.assertTrue(public_dict[Labels.Variants][0][Labels.VariantType] == VARIANT_TYPE)

		new_product = self.add_product_without_variants()
		self.assertTrue(new_product in db.session)
		self.assertFalse(new_product.has_variants)




	def test_add_user_card(self):
		new_user = self.add_user()
		bad_card = self.add_custom_card(new_user, BLANK_INPUT, CARD_NUMBER, CARD_CVC, CARD_EXP_MONTH, CARD_EXP_YEAR)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, SHORT_CARD_NUMBER, CARD_CVC, CARD_EXP_MONTH, CARD_EXP_YEAR)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, BLANK_INPUT, CARD_CVC, CARD_EXP_MONTH, CARD_EXP_YEAR)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, TEXT_INPUT, CARD_CVC, CARD_EXP_MONTH, CARD_EXP_YEAR)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, CARD_NUMBER, TEXT_INPUT, CARD_EXP_MONTH, CARD_EXP_YEAR)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, CARD_NUMBER, BLANK_INPUT, CARD_EXP_MONTH, CARD_EXP_YEAR)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, CARD_NUMBER, CARD_CVC, TEXT_INPUT, CARD_EXP_YEAR)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, CARD_NUMBER, CARD_CVC, BLANK_INPUT, CARD_EXP_YEAR)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, CARD_NUMBER, CARD_CVC, SHORT_EXPIRY, CARD_EXP_YEAR)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, CARD_NUMBER, CARD_CVC, CARD_EXP_MONTH, SHORT_EXPIRY)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, CARD_NUMBER, CARD_CVC, CARD_EXP_MONTH, BLANK_INPUT)
		self.assertFalse(bad_card.get(Labels.Success))
		bad_card = self.add_custom_card(new_user, NAME, CARD_NUMBER, CARD_CVC, CARD_EXP_MONTH, TEXT_INPUT)
		self.assertFalse(bad_card.get(Labels.Success))

		
		self.add_user_card(new_user)
		public_dict = new_user.toPublicDict()
		self.assertTrue(len(public_dict[Labels.Cards]) == 1)
		self.assertTrue(public_dict[Labels.Cards][0][Labels.Last4] == CARD_NUMBER[-4:])

	def test_add_user_address(self):
		new_user = self.add_user()
		bad_address = self.add_custom_address(new_user, DESCRIPTION, BLANK_INPUT, ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_CITY, ADDRESS_STATE, ADDRESS_ZIP, ADDRESS_COUNTRY)
		self.assertFalse(bad_address.get(Labels.Success))
		bad_address = self.add_custom_address(new_user, DESCRIPTION, ADDRESS_NAME, BLANK_INPUT, ADDRESS_LINE2, ADDRESS_CITY, ADDRESS_STATE, ADDRESS_ZIP, ADDRESS_COUNTRY)
		self.assertFalse(bad_address.get(Labels.Success))

		bad_address = self.add_custom_address(new_user, DESCRIPTION, ADDRESS_NAME, ADDRESS_LINE1, ADDRESS_LINE2, BLANK_INPUT, ADDRESS_STATE, ADDRESS_ZIP, ADDRESS_COUNTRY)
		self.assertFalse(bad_address.get(Labels.Success))
		bad_address = self.add_custom_address(new_user, DESCRIPTION, ADDRESS_NAME, ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_CITY, BLANK_INPUT, ADDRESS_ZIP, ADDRESS_COUNTRY)
		self.assertFalse(bad_address.get(Labels.Success))
		bad_address = self.add_custom_address(new_user, DESCRIPTION, ADDRESS_NAME, ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_CITY, ADDRESS_STATE, BLANK_INPUT, ADDRESS_COUNTRY)
		self.assertFalse(bad_address.get(Labels.Success))
		bad_address = self.add_custom_address(new_user, DESCRIPTION, ADDRESS_NAME, ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_CITY, ADDRESS_STATE, WRONG_ZIP, ADDRESS_COUNTRY)
		self.assertFalse(bad_address.get(Labels.Success))
		bad_address = self.add_custom_address(new_user, DESCRIPTION, ADDRESS_NAME, ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_CITY, ADDRESS_STATE, ADDRESS_ZIP, BLANK_INPUT)
		self.assertFalse(bad_address.get(Labels.Success))

		self.add_user_address(new_user)
		public_dict = new_user.toPublicDict()
		self.assertTrue(len(public_dict[Labels.Addresses]) == 1)
		self.assertTrue(public_dict[Labels.Addresses][0][Labels.AddressLine1] == ADDRESS_LINE1)



	def test_add_to_cart(self):
		new_user = self.add_user()
		response = self.add_item_with_variant_to_cart(new_user, UNAVAILABLE_INVENTORY)
		self.assertFalse(response.get(Labels.Success))
		
		self.add_item_without_variant_to_cart(new_user, AVAILABLE_INVENTORY )
		public_dict = new_user.toPublicDict()
		self.assertTrue(len(public_dict[Labels.Cart][Labels.Items]) == 1)

		response = self.add_item_without_variant_to_cart(new_user, UNAVAILABLE_INVENTORY)
		self.assertFalse(response.get(Labels.Success))


		self.add_item_with_variant_to_cart(new_user, AVAILABLE_INVENTORY)
		public_dict = new_user.toPublicDict()
		self.assertTrue(len(public_dict[Labels.Cart][Labels.Items]) == 2)		

	# def test_email_confirm(self):
	# 	new_user = self.add_user()
	# 	new_user.confirmEmail()
	# 	self.assertTrue(new_user.email_confirmed)



	def checkout_user_cart(self, new_user, card_id, address_id):
		checkout_cart_response = Checkout.checkoutCart(new_user, card_id, address_id)
		return checkout_cart_response


	def add_user_with_info(self):
		new_user = self.add_user()
		self.add_user_card(new_user)
		self.add_user_address(new_user)
		return new_user

	def test_checkout_user_cart(self):
		new_user = self.add_user_with_info()


		response = self.add_item_with_variant_to_cart(new_user, AVAILABLE_INVENTORY)
		self.assertTrue(response.get(Labels.Success))
		response = self.add_item_without_variant_to_cart(new_user, AVAILABLE_INVENTORY)
		self.assertTrue(response.get(Labels.Success))

		products = MarketProduct.query.filter_by().all()
		for product in products:
			product.inventory = 0
			db.session.commit()


		public_dict = new_user.toPublicDict()
		card_id = public_dict[Labels.Cards][0][Labels.Id]
		address_id = public_dict[Labels.Addresses][0][Labels.Id]
		checkout_cart_response = self.checkout_user_cart(new_user, card_id, address_id)

		self.assertFalse(checkout_cart_response[Labels.Success])
		products = MarketProduct.query.filter_by().all()
		for product in products:
			product.inventory = TEST_INVENTORY
			db.session.commit()

		checkout_cart_response = self.checkout_user_cart(new_user, card_id, address_id)
		self.assertFalse(checkout_cart_response[Labels.Success])		


		products = MarketProduct.query.filter_by().all()
		for product in products:
			product.inventory = INVENTORY
			db.session.commit()

		checkout_cart_response = self.checkout_user_cart(new_user, card_id, address_id)
		self.assertTrue(checkout_cart_response[Labels.Success])



		orders = new_user.getUserOrders()
		self.assertTrue(len(orders) == 1)

		for item in orders[0][Labels.Items]:
			if item[Labels.VariantId]:
				self.assertEqual(item[Labels.Name], NAME + "_" + VARIANT_TYPE)
			else:
				self.assertEqual(item[Labels.Name], NAME)

			self.assertEqual(item[Labels.NumItems], TEST_INVENTORY)			
			self.assertEqual(item[Labels.TotalPrice], round(float(PRICE * TEST_INVENTORY),2))
			

			







if __name__ == "__main__":
	unittest.main(warnings = 'ignore')
