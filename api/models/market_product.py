"""
: module containing the MarketProduct class 
"""
import random
import time
import datetime
import traceback
from api.s3.s3_api import S3
from api.utility.table_names import ProdTables
from api.utility.labels import MarketProductLabels as Labels
from api.models.shared_models import db
from api.models.product_image import ProductImage
from api.models.product_search_tag import ProductSearchTag
from api.models.product_listing_tag import ProductListingTag
from api.models.related_product_tag import RelatedProductTag
from api.models.manufacturer import Manufacturer


DEFAULT_MANUFACTURER = {
	Labels.Name : "MANUFACTURER NOT SET",
	Labels.Email : "spallstar28@gmail.com",
	Labels.Fee : 0,
}
class MarketProduct(db.Model):
	"""
	: Edgar USA product class
	: implemented with SQL Alchemy 
	"""
	__tablename__ = ProdTables.MarketProductTable
	INTEGER_INPUTS = [Labels.ManufacturerId, Labels.Price, Labels.Inventory, Labels.NumItemsLimit, Labels.ProductTemplate]
	product_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	name = db.Column(db.String, default = "Sample Name")
	price = db.Column(db.Integer, default = 0)
	category = db.Column(db.String, default = "Sample Category")
	description = db.Column(db.String, default = "Sample Description")
	num_images = db.Column(db.Integer, nullable = False, default = 0)
	main_image = db.Column(db.String)
	inventory = db.Column(db.Integer, default = 0)
	active = db.Column(db.Boolean, default = False)
	num_items_limit = db.Column(db.Integer, default = 50)
	has_variants = db.Column(db.Boolean, default = False)
	variant_type_description = db.Column(db.String, default = "type")
	live = db.Column(db.Boolean, default = False)
	product_template = db.Column(db.Integer, default = 2)
	manufacturer = db.Column(db.String)

	second_tab_name = db.Column(db.String)
	second_tab_text = db.Column(db.String)
	
	quadrant1 = db.Column(db.String)
	quadrant2 = db.Column(db.String)
	quadrant3 = db.Column(db.String)
	quadrant4 = db.Column(db.String)

	

	sale_text_product = db.Column(db.String)
	sale_text_home = db.Column(db.String)

	sale_end_date = db.Column(db.DateTime)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# add relationships 
	search_tag = db.relationship("ProductSearchTag", backref = ProdTables.ProductSearchTagTable, lazy='dynamic')
	listing_tag = db.relationship("ProductListingTag", backref = ProdTables.ProductListingTagTable, lazy='dynamic')
	related_product_tag = db.relationship("RelatedProductTag", backref = ProdTables.RelatedProductTagTable, lazy='dynamic')
	image_id = db.relationship("ProductImage", backref = ProdTables.ImageTable, lazy='dynamic')
	manufacturer_id = db.Column(db.Integer, db.ForeignKey(ProdTables.ManufacturerTable + '.' + Labels.ManufacturerId))

	def __init__(self, name):
		self.name = name
		db.Model.__init__(self)

	def isAvailable(self):
		"""
		: returns false if this product has no inventory or
		: products with variants must have all variants out of stock to be unavailable
		: or the sale end date has passed. 
		: otherwise returns true
		"""
		if self.has_variants:	
			product_variants = self.getProductVariants()
			variants_in_stock = False
			for variant in product_variants:
				if variant.inventory > 0:
					variants_in_stock = True
			if not variants_in_stock:
				return False
		else:
			if self.inventory == 0:
				return False

		return True
		
	def getProductImages(self):
		"""
		: Returns this products image information
		: as a public dictionaries
		"""
		images = ProductImage.query.filter_by(product_id = self.product_id).all()
		image_list = list()
		for image in images:
			if not image.soft_deleted:
				image_dict = image.toPublicDict()
				if image.image_id == self.main_image:
					image_list.insert(0,image_dict)
				else:
					image_list.append(image_dict)
		return image_list

	@staticmethod
	def getAllProducts():
		"""
		: returns all products as list of public dictionaries
		"""
		products = MarketProduct.query.filter().order_by(MarketProduct.date_created).all()
		return [product.toPublicDict(get_related_products = False) for product in products]

	@staticmethod
	def getActiveProducts():
		"""
		: returns a list of all active products as a list of public dictionaries
		"""
		active_products = MarketProduct.query.filter_by(active = True).all()
		return [product.toPublicDict() for product in active_products]

	def addProductImage(self, image_decoded, set_as_main_image = False):
		"""
		: adds the product image to S3 database for this product
		: image_decoded is base64.decodestring() object
		"""

		# record the image_id in the database
		image_record = ProductImage(self.product_id)
		# sets this image to main image if does not exist 
		# of we choose it to
		if self.getProductImages():
			self.main_image = image_record.image_id
		elif set_as_main_image:
			self.main_image = image_record.image_id

		# upload the image to S3
		S3.uploadProductImage(image_record.image_id, image_decoded)
		db.session.add(image_record)
		db.session.commit()

	

	def activateProduct(self):
		"""
		: sets this product to being active
		"""
		self.active = True
		db.session.commit()

	def deactivateProduct(self):
		"""
		: Sets this product to being inactive
		"""
		self.active = False
		db.session.commit()

	def addProductVariant(self, variant_type, price = 0, inventory = 0):
		"""
		: Adds a new variant for this product
		: stores in the database
		"""
		new_variant = ProductVariant(self.product_id, variant_type, price, inventory)
		db.session.add(new_variant)
		db.session.commit()

	
	def addProductVariants(self, variant_types):
		"""
		: Adds a list of variants to this product
		"""

		# we check if it is a product that has variants
		assert self.has_variants
		assert variant_types
		for variant_type in variant_types:
			self.addProductVariant(variant_type)

	def getProductVariants(self):
		"""
		: Returns a list of all product variants of this product
		"""
		variants = ProductVariant.query.filter_by(product_id = self.product_id).all()
		return variants

	def getProductVariant(self, variant_id):
		"""
		: Returns the product variant by variant_id
		"""
		variant = ProductVariant.query.filter_by(product_id = self.product_id, variant_id = variant_id).first()
		return variant

	@staticmethod
	def getProductById(product_id):
		"""
		: Returns the market product by product_id
		"""
		return MarketProduct.query.filter_by(product_id = product_id).first()

	@staticmethod
	def getProductsByListingTag(tag):
		"""
		: Returns all products matching this listing tag
		"""
		tag_matches = ProductListingTag.query.filter_by(tag = tag).all()
		product_matches = []
		for match in tag_matches:
			matching_product = MarketProduct.query.filter_by(active = True, product_id = match.product_id).first()
			if matching_product:
				product_matches.append(matching_product)
		return product_matches

	@staticmethod
	def getProductsBySearchTag(tag):
		"""
		: Returns all products matching this search tag
		"""
		tag_matches = ProductSearchTag.query.filter_by(tag = tag).all()
		product_matches = []
		for match in tag_matches:
			matching_product = MarketProduct.query.filter_by(active = True, product_id = match.product_id).first()
			if matching_product:
				product_matches.append(matching_product)
		return product_matches

	def getRelatedProductsByTag(self, limit = 5):
		"""
		: Returns all products that have the same
		: related products tags as this one
		"""
		this_product_tags = RelatedProductTag.query.filter_by(product_id = self.product_id).all()
		if not this_product_tags:
			return []

		this_product_tag_list = [tag.tag for tag in this_product_tags]

		matching_tags = RelatedProductTag.query.filter(RelatedProductTag.tag.in_(this_product_tag_list)).all()
		product_id_matches = set()
		for tag in matching_tags:
			product_id_matches.add(tag.product_id)

		matching_products = MarketProduct.query.filter(MarketProduct.product_id.in_(product_id_matches)).all()

		random.shuffle(matching_products)
		# this 0:5 is hard coded as a limit for now, will discuss limits 
		# and filters moving forward
		return matching_products[0:limit]


	def updateProductSearchTags(self, tags):
		"""
		: updates this products search tags
		: tags is a list of strings
		"""
		old_tags = ProductSearchTag.query.filter_by(product_id = self.product_id).all()
		for old_tag in old_tags:
			db.session.delete(old_tag)
		db.session.commit()

		for tag in tags:
			new_tag = ProductSearchTag(self.product_id, tag)
			db.session.add(new_tag)
		db.session.commit()

	def updateProductListingTags(self, tags):
		"""
		: updates this products listing tags
		: tags is a list of strings
		"""
		old_tags = ProductListingTag.query.filter_by(product_id = self.product_id).all()
		for old_tag in old_tags:
			db.session.delete(old_tag)
		db.session.commit()

		for tag in tags:
			new_tag = ProductListingTag(self.product_id, tag)
			db.session.add(new_tag)
		db.session.commit()

	def updateRelatedProductTags(self, tags):
		"""
		: updates this products related product tags
		: tags is a list of strings
		"""
		old_tags = RelatedProductTag.query.filter_by(product_id = self.product_id).all()
		for old_tag in old_tags:
			db.session.delete(old_tag)
		db.session.commit()

		for tag in tags:
			new_tag = RelatedProductTag(self.product_id, tag)
			db.session.add(new_tag)
		db.session.commit()

	def getManufacturerInfo(self):
		"""
		: returns this products manufactuers info as a public dict
		"""
		if self.manufacturer_id is None:
			return DEFAULT_MANUFACTURER
		this_manufacturer = Manufacturer.query.filter_by(manufacturer_id = self.manufacturer_id).first()
		if this_manufacturer:
			return this_manufacturer.toPublicDict()
		else:
			return DEFAULT_MANUFACTURER

	def getManufacturerName(self):
		return self.getManufacturerInfo()[Labels.Name]

	def toPublicDict(self, get_related_products = True):
		"""
		: Returns this market product as a public dictionary
		"""
		public_dict = {}
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Price] = self.price
		public_dict[Labels.Category] = self.category
		public_dict[Labels.Description] = self.description
		public_dict[Labels.Manufacturer] = self.getManufacturerInfo() 
		public_dict[Labels.ManufacturerId] = self.manufacturer_id 

		public_dict[Labels.Inventory] = self.inventory
		if self.sale_end_date:
			public_dict[Labels.SaleEndDate] = self.sale_end_date.strftime("%Y-%m-%dT%H:%M")
		else:
			public_dict[Labels.SaleEndDate] = None

		public_dict[Labels.DateCreated] = self.date_created
		public_dict[Labels.ProductId] = self.product_id
		images = self.getProductImages()
		public_dict[Labels.Images] = images
		public_dict[Labels.NumImages] = len(images)
		public_dict[Labels.MainImage] = self.main_image
		public_dict[Labels.ProductTemplate] = self.product_template
		public_dict[Labels.NumItemsLimit] = self.num_items_limit
		public_dict[Labels.Active] = self.active
		public_dict[Labels.HasVariants] = self.has_variants
		public_dict[Labels.Live] = self.live
		public_dict[Labels.SaleTextProduct] = self.sale_text_product
		public_dict[Labels.SaleTextHome] = self.sale_text_home
		public_dict[Labels.Quadrant1] = self.quadrant1
		public_dict[Labels.Quadrant2] = self.quadrant2
		public_dict[Labels.Quadrant3] = self.quadrant3
		public_dict[Labels.Quadrant4] = self.quadrant4
		
		public_dict[Labels.VariantTypeDescription] = self.variant_type_description
		variants = ProductVariant.query.filter_by(product_id = self.product_id).all()
		public_dict[Labels.Variants] = [variant.toPublicDict() for variant in variants]
		public_dict[Labels.IsAvailable] = self.isAvailable()
		if get_related_products:
			product_search_tags = ProductSearchTag.query.filter_by(product_id = self.product_id).all()
			related_product_tags = RelatedProductTag.query.filter_by(product_id = self.product_id).all()
			product_listing_tags = ProductListingTag.query.filter_by(product_id = self.product_id).all()
			public_dict[Labels.RelatedProductTags] = ",".join([tag.tag for tag in related_product_tags])
			public_dict[Labels.ProductSearchTags] = ",".join([tag.tag for tag in product_search_tags])
			public_dict[Labels.ProductListingTags] = ",".join([tag.tag for tag in product_listing_tags])
			related_products = self.getRelatedProductsByTag()
			public_dict[Labels.RelatedProducts] = [product.toPublicDict(get_related_products = False) for product in related_products]
		return public_dict


class ProductVariant(db.Model):
	"""
	: Product Variant Class
	: If a product has more than one type of itself use this to distinguish
	: References original product through product_id reference
	: Flask SQL Alchemy implementation
	"""
	__tablename__ = ProdTables.ProductVariantTable
	variant_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	product_id = db.Column(db.Integer, db.ForeignKey(ProdTables.MarketProductTable + '.' + Labels.ProductId))
	inventory = db.Column(db.Integer, default = 0)
	variant_type = db.Column(db.String)
	active = db.Column(db.Boolean, default = False)
	price = db.Column(db.Integer)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())


	def __init__(self, product_id, variant_type, price, inventory = 0):
		self.product_id = product_id
		self.variant_type = variant_type
		self.price = price
		self.inventory = inventory
		db.Model.__init__(self)
		
	def updateVariant(self, variant):
		"""
		: Updates this variant with new information
		"""
		
		new_inventory = variant.get(Labels.Inventory)
		if new_inventory:
			self.inventory = new_inventory
		new_price = variant.get(Labels.Price)
		if new_price:
			self.price = new_price
		new_type = variant.get(Labels.VariantType)
		if new_type:
			self.variant_type = new_type

		db.session.commit()

	def delete(self):
		"""
		: Deletes this variant
		"""
		db.session.delete(self)
		db.session.commit()

	@staticmethod
	def activateVariant(variant_id):
		"""
		: Deactivates variant by variant_id
		"""
		this_variant = ProductVariant.query.filter_by(variant_id = variant_id).first()
		this_variant.active = True
		db.session.commit()

	@staticmethod
	def deactivateVariant(variant_id):
		"""
		: Deactivates variant by variant_id
		"""
		this_variant = ProductVariant.query.filter_by(variant_id = variant_id).first()
		this_variant.active = False
		db.session.commit()

	def toPublicDict(self):
		"""
		: Returns this variant as a public dictionary
		"""
		public_dict = {}
		public_dict[Labels.Inventory] = self.inventory
		public_dict[Labels.VariantType] = self.variant_type
		public_dict[Labels.ProductId] = self.product_id
		public_dict[Labels.VariantId] = self.variant_id
		public_dict[Labels.Active] = self.active
		public_dict[Labels.Price] = self.price
		return public_dict
