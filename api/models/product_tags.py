from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import ProductTagLabels as Labels

## I understand there are magic strings in this, but not sure the best way to get around it right now
## it's mostly an issue in the updateSettings which takes a dictionary as input, but we'll see

MARKET_PHOTO_STORAGE_BUCKET = "publicmarketproductphotos" 	

## user object class
class ProductTag(db.Model):
	__tablename__ = TestTables.ProductTagTable
	product_tag_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	tag = db.Column(db.String)
	product_id = db.Column(db.Integer, db.ForeignKey(TestTables.MarketProductTable + '.' + Labels.ProductId))
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())


	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, product_id, tag):
		self.product_id = product_id
		self.tag = tag
		db.Model.__init__(self)
		

	def toPublicDict(self):
		public_dict = {}
		public_dict['product_id'] = self.product_id
		public_dict['tag'] = self.tag
		return public_dict




