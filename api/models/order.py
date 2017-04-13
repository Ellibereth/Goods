from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from passlib.hash import argon2
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import OrderLabels as Labels

## I understand there are magic strings in this, but not sure the best way to get around it right now
## it's mostly an issue in the updateSettings which takes a dictionary as input, but we'll see
		
## user object class
class Order(db.Model):
	__tablename__ = TestTables.OrderTable
	order_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	price = db.Column(db.Float)
	stripe_customer_id = db.Column(db.String, unique = True, nullable = False)
	stripe_charge_id = db.Column(db.String, unique = True, nullable = False)
	refund_date = db.Column(db.DateTime)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	product_id = db.Column(db.Integer, db.ForeignKey(TestTables.MarketProductTable + '.' + Labels.ProductId))
	account_id = db.Column(db.Integer, db.ForeignKey(TestTables.UserInfoTable + '.' + Labels.AccountId))

	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, user, product, stripe_charge_id):
		self.price = product.price
		self.stripe_customer_id = user.stripe_customer_id
		self.stripe_charge_id = stripe_charge_id
		db.Model.__init__(self)
		

	def toPublicDict(self):
		public_dict = {}
		public_dict['name'] = self.name
		public_dict['price'] = self.price
		public_dict['date_created'] = self.date_created
		public_dict['stripe_customer_id'] = self.stripe_customer_id
		public_dict['stripe_charge_id'] = self.stripe_charge_id
		public_dict['order_id'] = self.order_id
		return public_dict




