from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.models.shared_models import db
import time
import random
import string
import json

from api.utility.labels import MarketProductLabels as Labels
from api.models.product_image import ProductImage

## I understand there are magic strings in this, but not sure the best way to get around it right now
## it's mostly an issue in the updateSettings which takes a dictionary as input, but we'll see

MARKET_PHOTO_STORAGE_BUCKET = "publicmarketproductphotos" 	


## user object class
class MarketProduct(db.Model):
	__tablename__ = ProdTables.MarketProductTable
	product_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	name = db.Column(db.String, nullable = False)
	price = db.Column(db.Float, nullable = False)
	category = db.Column(db.String)
	description = db.Column(db.String)
	num_images = db.Column(db.Integer, nullable = False, default = 0)
	main_image = db.Column(db.String)
	inventory = db.Column(db.Integer, nullable = False)
	soft_deleted = db.Column(db.Boolean, default = False)
	manufacturer = db.Column(db.String)
	# figure out input for this
	sale_end_date = db.Column(db.DateTime)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# add relationships 
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
		
	def getProductImages(self):
		images = ProductImage.query.filter_by(product_id = self.product_id).all()
		image_list = list()
		for image in images:
			image_dict = image.toPublicDict()
			image_dict[Labels.MainImage] = (self.main_image == image.image_id)
			image_list.append(image_dict)
		return image_list

	def addProductImage(self, image_decoded):
		# record the image_id in the database
		image_record = ProductImage(self.product_id)
		db.session.add(image_record)
		# upload the image to S3
		S3.uploadProductImage(image_record.image_id, image_decoded)
		# sets this image to main image if does not exist
		if self.num_images == 0:
			self.main_image = image_record.image_id
		self.num_images = ProductImage.query.filter_by(product_id = self.product_id).count()
		# commit to database
		db.session.commit()

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Price] = self.price
		public_dict[Labels.Category] = self.category
		public_dict[Labels.Description] = self.description
		public_dict[Labels.Manufacturer] = self.manufacturer
		public_dict[Labels.Inventory] = self.inventory
		public_dict[Labels.SaleEndDate] = self.sale_end_date.strftime('%Y-%m-%dT%H:%M:%S')
		public_dict[Labels.DateCreated] = self.date_created
		public_dict[Labels.NumImages] = self.num_images
		public_dict[Labels.ProductId] = self.product_id
		public_dict[Labels.Images] = self.getProductImages()
		return public_dict




