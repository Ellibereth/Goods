from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from passlib.hash import argon2
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import PaymentLabels as Labels
from api.utility.id_util import IdUtil
from api.models.market_product import MarketProduct
from api.utility.lob import Lob
from api.utility.stripe_api import StripeManager

## I understand there are magic strings in this, but not sure the best way to get around it right now
## it's mostly an issue in the updateSettings which takes a dictionary as input, but we'll see
		
## user object class
class Order(db.Model):
	__tablename__ = ProdTables.OrderTable
	primary_key = db.Column(db.Integer, primary_key = True, autoincrement = True)
	order_id = db.Column(db.String)
	price = db.Column(db.Float)
	num_items = db.Column(db.Integer)
	stripe_customer_id = db.Column(db.String, nullable = False)
	stripe_charge_id = db.Column(db.String, nullable = False)
	refund_date = db.Column(db.DateTime)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	lob_address_id = db.Column(db.String)
	address_line1 = db.Column(db.String)
	address_line2 = db.Column(db.String)
	address_zip = db.Column(db.String)
	address_country = db.Column(db.String)
	address_city = db.Column(db.String)
	address_name = db.Column(db.String)
	address_description = db.Column(db.String)
	address_state = db.Column(db.String)

	product_id = db.Column(db.Integer, db.ForeignKey(ProdTables.MarketProductTable + '.' + Labels.ProductId))
	account_id = db.Column(db.Integer, db.ForeignKey(ProdTables.UserInfoTable + '.' + Labels.AccountId))

	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, order_id, user, product, address, stripe_charge, num_items = 1):
		self.order_id = order_id
		self.price = product.price
		self.num_items = num_items
		self.product_id = product.product_id
		self.account_id = user.account_id
		self.stripe_customer_id = user.stripe_customer_id
		self.stripe_charge_id = stripe_charge[Labels.Id]
		self.lob_address_id = address.id
		self.address_name = address.name
		self.address_description = address.description
		self.address_city = address.address_city
		self.address_country = address.address_country
		self.address_line1 = address.address_line1
		self.address_line2 = address.address_line2
		self.address_zip = address.address_zip
		self.address_state = address.address_state
		db.Model.__init__(self)
		
	@staticmethod
	def generateOrderId():
		new_order_id = IdUtil.id_generator()
		missing = Order.query.filter_by(order_id = new_order_id).all()
		while missing:
			new_order_id = IdUtil.id_generator()
			missing = Order.query.filter_by(order_id = new_order_id).all()
		return new_order_id

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.OrderId] = self.order_id
		public_dict[Labels.Product] = MarketProduct.query.filter_by(product_id = self.product_id).first().toPublicDict()
		public_dict[Labels.NumItems] = self.num_items
		public_dict[Labels.Price] = self.price
		public_dict[Labels.TotalPrice] = self.price * self.num_items
		public_dict[Labels.DateCreated] = self.date_created
		address = {
			Labels.AddressName : self.address_name,
			Labels.AddressDescription : self.address_description,
			Labels.AddressCity : self.address_city,
			Labels.AddressCountry : self.address_country,
			Labels.AddressLine1 : self.address_line1,
			Labels.AddressLine2 : self.address_line2,
			Labels.AddressZip : self.address_zip,
			Labels.AddressState : self.address_state
		}
		public_dict[Labels.Address] = address
		public_dict[Labels.Card] = StripeManager.getCardFromChargeId(self.stripe_charge_id)
		return public_dict





