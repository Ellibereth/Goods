from flask import Flask
from flask.ext.testing import TestCase
from api.models.shared_models import db

from api.models.user import User
from api.models.market_product import MarketProduct, ProducVariant
from api.models.cart import Cart, CartItem
from api.models.order import Order, OrderItem


class TestModels(TestCase):
	def create_app(self):
		SQLALCHEMY_DATABASE_URI = "postgres://sjlekkgepnocjg:cbaa9888fd46d74bf9491ecacde5e24b52de0c7d74e4047cf0cbfc40136bc73f@ec2-107-21-108-204.compute-1.amazonaws.com:5432/d9p390sjrd817i"
		app.config['TESTING'] = True
		
		app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
		app = Flask(__name__)
		db.init_app(app)
		return app

	 def setUp(self):
		db.create_all()

	def tearDown(self):
		db.session.remove()
		db.drop_all()

	def test_add_user(self):
		# user = User()
		# db.session.add(user)
		db.session.commit()
		
		# this works
		# assert user in db.session
