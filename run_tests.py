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

SAMPLE_NAME = "Sample Name"
SAMPLE_EMAIL = "spallstar28@gmail.com"
SAMPLE_PASSWORD = "password1"
SAMPLE_EMAIL_CONFIMRATION_ID = "QWERTU1234"
SAMPLE_PRICE = 5.99
SAMPLE_INVENTORY = 10
SAMPLE_VARIANT_TYPE = "blue"

# these ones will be a valid set, soon will add an invalid set 
SAMPLE_ADDRESS_DESCRIPTION = "SAMPLE DESCRIPTION",
SAMPLE_ADDRESS_NAME = "Sample Name"
SAMPLE_ADDRESS_LINE1 = "17769 Steading Rd"
SAMPLE_ADDRESS_LINE2 = ""
SAMPLE_ADDRESS_STATE = "MN"
SAMPLE_ADDRESS_CITY = "Eden Prairie"
SAMPLE_ADDRESS_COUNTRY = "US"
SAMPLE_ADDRESS_ZIP = "55347"

SAMPLE_CARD_NUMBER = "4242424242424242"
SAMPLE_CARD_CVC = "123"
SAMPLE_CARD_NAME = "Vladimir Kramnik"
SAMPLE_CARD_EXP_MONTH =  "02"
SAMPLE_CARD_EXP_YEAR =  "20"



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
		new_user =  User(SAMPLE_NAME, SAMPLE_EMAIL, SAMPLE_PASSWORD, SAMPLE_EMAIL_CONFIMRATION_ID)
		new_user.account_id = random.randint(100000, 200000)
		db.session.add(new_user)
		db.session.commit()
		return new_user

	def add_product_without_variants(self):
		new_product = MarketProduct(SAMPLE_NAME)
		new_product.has_variants = False
		new_product.price = SAMPLE_PRICE
		new_product.inventory = SAMPLE_INVENTORY

		db.session.add(new_product)
		db.session.commit()
		return new_product

	def add_product_with_variants(self):
		new_product = MarketProduct(SAMPLE_NAME)
		new_product.has_variants = True
		db.session.add(new_product)
		db.session.commit()
		new_product.addProductVariant(variant_type = SAMPLE_VARIANT_TYPE, price = SAMPLE_PRICE, inventory = SAMPLE_INVENTORY)
		
		return new_product



	

	def add_item_without_variant_to_cart(self, new_user):
		new_product = self.add_product_without_variants()
		AVAILABLE_QUANTITY = 5
		UNAVAILABLE_QUANTITY = 15
		new_user.addItemToCart(new_product.product_id, AVAILABLE_QUANTITY, variant_id = None)

	def add_item_with_variant_to_cart(self, new_user):
		new_product = self.add_product_without_variants()
		AVAILABLE_QUANTITY = 5
		UNAVAILABLE_QUANTITY = 15
		new_user.addItemToCart(new_product.product_id, AVAILABLE_QUANTITY, variant_id = None)

	def add_user_address(self, new_user):
		new_address_response =  new_user.addAddress(SAMPLE_ADDRESS_DESCRIPTION, SAMPLE_ADDRESS_NAME, SAMPLE_ADDRESS_LINE1, SAMPLE_ADDRESS_LINE2, SAMPLE_ADDRESS_CITY, SAMPLE_ADDRESS_STATE,
			SAMPLE_ADDRESS_ZIP, SAMPLE_ADDRESS_COUNTRY)
		return new_address_response

	def add_user_card(self, new_user):
		new_card_response = new_user.addCreditCard(SAMPLE_ADDRESS_CITY, SAMPLE_ADDRESS_LINE1, SAMPLE_ADDRESS_LINE2, 
		SAMPLE_ADDRESS_ZIP, SAMPLE_CARD_EXP_MONTH, SAMPLE_CARD_EXP_YEAR, SAMPLE_CARD_NUMBER,
		 SAMPLE_CARD_CVC, SAMPLE_CARD_NAME, SAMPLE_ADDRESS_STATE, SAMPLE_ADDRESS_COUNTRY)
		return new_card_response



	def test_add_product(self):
		new_product = self.add_product_with_variants()
		self.assertTrue(new_product in db.session)
		self.assertTrue(new_product.has_variants == True)
		public_dict = new_product.toPublicDict()
		self.assertTrue(len(public_dict['variants']) == 1)
		self.assertTrue(public_dict['variants'][0]['variant_type'] == SAMPLE_VARIANT_TYPE)

		new_product = self.add_product_without_variants()
		self.assertTrue(new_product in db.session)
		self.assertTrue(new_product.has_variants == False)



	def test_add_user_address(self):
		new_user = self.add_user()
		self.add_user_address(new_user)
		public_dict = new_user.toPublicDict()
		self.assertTrue(len(public_dict['addresses']) == 1)
		self.assertTrue(public_dict['addresses'][0]['address_line1'] == SAMPLE_ADDRESS_LINE1)



	def test_add_to_cart(self):
		new_user = self.add_user()
		self.add_item_without_variant_to_cart(new_user)
		public_dict = new_user.toPublicDict()
		self.assertTrue(len(public_dict['cart']['items']) == 1)

		self.add_item_with_variant_to_cart(new_user)
		public_dict = new_user.toPublicDict()
		self.assertTrue(len(public_dict['cart']['items']) == 2)		

	def test_add_user(self):
		new_user =  self.add_user()
		self.assertTrue(new_user in db.session)

	def test_email_confirm(self):
		new_user = self.add_user()
		new_user.confirmEmail()
		self.assertTrue(new_user.email_confirmed)


	def test_add_user_card(self):
		new_user = self.add_user()
		self.add_user_card(new_user)
		public_dict = new_user.toPublicDict()
		self.assertTrue(len(public_dict['cards']) == 1)
		self.assertTrue(public_dict['cards'][0]['last4'] == SAMPLE_CARD_NUMBER[-4:])



if __name__ == "__main__":
	unittest.main(warnings = 'ignore')
