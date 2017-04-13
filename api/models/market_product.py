from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import MarketProductLabels as Labels

## I understand there are magic strings in this, but not sure the best way to get around it right now
## it's mostly an issue in the updateSettings which takes a dictionary as input, but we'll see

MARKET_PHOTO_STORAGE_BUCKET = "publicmarketproductphotos" 	


## user object class
class MarketProduct(db.Model):
	__tablename__ = TestTables.MarketProductTable
	product_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	name = db.Column(db.String, nullable = False)
	price = db.Column(db.Float, nullable = False)
	category = db.Column(db.String)
	description = db.Column(db.String)
	num_images = db.Column(db.Integer, nullable = False, default = 0)
	inventory = db.Column(db.Integer, nullable = False)
	soft_deleted = db.Column(db.Boolean, default = False)
	manufacturer = db.Column(db.String)
	# figure out input for this
	sale_end_date = db.Column(db.DateTime)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# an example to add relationships 
	tag = db.relationship("ProductTag", backref = TestTables.ProductTagTable, lazy='dynamic')
	image_id = db.relationship("ProductImage", backref = TestTables.ImageTable, lazy='dynamic')

	
	def __init__(self, name, price, category, description, manufacturer, inventory, sale_end_date):
		self.price = price
		self.name = name
		self.category = category
		self.description = description
		self.manufacturer = manufacturer
		self.inventory = inventory
		self.sale_end_date = sale_end_date
		db.Model.__init__(self)
		

	def toPublicDict(self):
		public_dict = {}
		public_dict['name'] = self.name
		public_dict['price'] = self.price
		public_dict['category'] = self.category
		public_dict['description'] = self.description
		public_dict['manufacturer'] = self.manufacturer
		public_dict['name'] = self.inventory
		public_dict['sale_end_date'] = self.sale_end_date
		public_dict['date_created'] = self.date_created
		public_dict['num_images'] = self.num_images
		return public_dict




