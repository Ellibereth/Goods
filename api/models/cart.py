from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from passlib.hash import argon2
from api.models.shared_models import db
import time
from api.utility.labels import MarketProductLabels as Labels

## I understand there are magic strings in this, but not sure the best way to get around it right now
## it's mostly an issue in the updateSettings which takes a dictionary as input, but we'll see

## user object class
class Cart(db.Model):
	__tablename__ = ProdTables.ShoppingCartTable
	cart_item_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	account_id = db.Column(db.Integer, db.ForeignKey(ProdTables.UserInfoTable + '.' + Labels.Account))
	product_id = db.Column(db.Integer, db.ForeignKey(ProdTables.MarketProductTable + '.' + Labels.ProductId))
	num_items = db.Column(db.Integer)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, account_id, product_id, num_items):
		self.account_id = account_id
		self.product_id = product_id
		self.num_items = num_items
		db.Model.__init__(self)		

	def toPublicDict(self):
		public_dict = {}
		return public_dict




