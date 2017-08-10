from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.models.shared_models import db
import time
import random
import string
import json
from api.utility.labels import MarketProductLabels as Labels
from api.models.product_image import ProductImage
from api.models.product_search_tag import ProductSearchTag
from api.models.product_listing_tag import ProductListingTag
from api.models.related_product_tag import RelatedProductTag
from api.models.manufacturer_logo import ManufacturerLogo
from api.s3.s3_api import S3


class MarketProduct(db.Model):
	__tablename__ = ProdTables.MarketProductTable
	INTEGER_INPUTS = [Labels.Price, Labels.Inventory, Labels.NumItemsLimit, Labels.ProductTemplate]
	product_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	name = db.Column(db.String, default = "Sample Name")
	price = db.Column(db.Integer, default = 0)
	category = db.Column(db.String, default = "Sample Category")
	description = db.Column(db.String, default = "Sample Description")
	num_images = db.Column(db.Integer, nullable = False, default = 0)
	main_image = db.Column(db.String)
	inventory = db.Column(db.Integer, default = 0)
	active = db.Column(db.Boolean, default = False)
	manufacturer = db.Column(db.String, default = "Sample Manufacturer")
	manufacturer_email = db.Column(db.String, default = "spallstar28@gmail.com")
	num_items_limit = db.Column(db.Integer, default = 50)
	has_variants = db.Column(db.Boolean, default = False)
	variant_type_description = db.Column(db.String, default = "type")
	live = db.Column(db.Boolean, default = False)
	product_template = db.Column(db.Integer, default = 2)

	second_tab_name = db.Column(db.String)
	second_tab_text = db.Column(db.String)
	
	quadrant1 = db.Column(db.String)
	quadrant2 = db.Column(db.String)
	quadrant3 = db.Column(db.String)
	quadrant4 = db.Column(db.String)

	show_manufacturer_logo = db.Column(db.Boolean, default = False)
	manufacturer_logo_id = db.Column(db.String)

	sale_text_product = db.Column(db.String)
	sale_text_home = db.Column(db.String)

	# this value is stored in ten thousands
	# so 500 => 5%
	manufacturer_fee = db.Column(db.Integer)

	sale_end_date = db.Column(db.DateTime)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# add relationships 
	search_tag = db.relationship("ProductSearchTag", backref = ProdTables.ProductSearchTagTable, lazy='dynamic')
	listing_tag = db.relationship("ProductListingTag", backref = ProdTables.ProductListingTagTable, lazy='dynamic')
	related_product_tag = db.relationship("RelatedProductTag", backref = ProdTables.RelatedProductTagTable, lazy='dynamic')
	image_id = db.relationship("ProductImage", backref = ProdTables.ImageTable, lazy='dynamic')


	def __init__(self, name):
		self.name = name
		db.Model.__init__(self)
		
	def getProductImages(self):
		images = ProductImage.query.filter_by(product_id = self.product_id).all()
		image_list = list()
		for image in images:
			if not image.soft_deleted:
				image_dict = image.toPublicDict()
				image_list.append(image_dict)
		return image_list

	@staticmethod
	def getAllProducts():
		products = MarketProduct.query.filter_by().all()
		return [product.toPublicDict() for product in products]

	@staticmethod
	def getActiveProducts():
		åctive_products = MarketProduct.query.filter_by(active = True).all()
		return [product.toPublicDict() for product in active_products]

	def addProductImage(self, image_decoded, set_as_main_image = False):
		# record the image_id in the database
		image_record = ProductImage(self.product_id)
		# sets this image to main image if does not exist
		if len(self.getProductImages()) == 0:
			self.main_image = image_record.image_id
		# upload the image to S3
		S3.uploadProductImage(image_record.image_id, image_decoded)
		db.session.add(image_record)
		db.session.commit()

	def addManufacturerLogo(self, image_decoded):
		# record the image_id in the database
		manufacturer_logo = ManufacturerLogo(self.product_id)
		self.manufacturer_logo_id = manufacturer_logo.logo_id
		db.session.add(manufacturer_logo)
		db.session.commit()

		# upload the image to S3
		S3.uploadManufacturerLogo(manufacturer_logo.logo_id, image_decoded)

	def activateProduct(self):
		self.active = True
		db.session.commit()

	def deactivateProduct(self):
		self.active = False
		db.session.commit()

	def addProductVariant(self, variant_type, price, inventory = 0):
		new_variant = ProductVariant(self.product_id, variant_type, price, inventory)
		db.session.add(new_variant)
		db.session.commit()

	
	def addProductVariants(self, variant_types):
		# we can either check if it is a product that has variants
		# or we can automatically make it one through this process
		assert(self.has_variants)
		assert(variant_types)
		for variant_type in variant_types:
			self.addProductVariant(variant_type)

	def getProductVariants(self):
		variants = ProductVariant.query.filter_by(product_id = self.product_id).all()
		return variants

	def getProductVariant(self, variant_id):
		variant = ProductVariant.query.filter_by(product_id = self.product_id, variant_id = variant_id).first()
		return variant

	@staticmethod
	def getProductById(product_id):
		return MarketProduct.query.filter_by(product_id = product_id).first()

	@staticmethod
	def getProductsByListingTag(tag):
		tag_matches = ProductListingTag.query.filter_by(tag = tag).all()
		product_matches = []
		for match in tag_matches:
			matching_product = MarketProduct.query.filter_by(active = True, product_id = match.product_id).first()
			if matching_product:
				product_matches.append(matching_product)
		return product_matches

	@staticmethod
	def getProductsBySearchTag(tag):
		tag_matches = ProductSearchTag.query.filter_by(tag = tag).all()
		product_matches = []
		for match in tag_matches:
			matching_product = MarketProduct.query.filter_by(active = True, product_id = match.product_id).first()
			if matching_product:
				product_matches.append(matching_product)
		return product_matches

	@staticmethod
	def getProductsByRelatedProductsTag(tag):
		tag_matches = RelatedProductTag.query.filter_by(tag = tag).all()
		product_matches = []
		for match in tag_matches:
			matching_product = MarketProduct.query.filter_by(active = True, product_id = match.product_id).first()
			if matching_product:
				product_matches.append(matching_product)
		return product_matches

	def getRelatedProductsByTag(self):
		this_product_tags = RelatedProductTag.query.filter_by(product_id = self.product_id).all()
		if len(this_product_tags) == 0:
			return []
			
		merged_list = list()
		for tag in this_product_tags:
			product_matches = MarketProduct.getProductsByRelatedProductsTag(tag.tag)
			merged_list = merged_list + product_matches 
		hit_product_ids = list()
		all_matches = list()
		# remove duplicates from the merged list
		for product in merged_list:
			if product.product_id != self.product_id:
				if product.product_id not in hit_product_ids:
					all_matches.append(product)
					hit_product_ids.append(product.product_id)

		random.shuffle(all_matches)
		# this 0:5 is hard coded as a limit for now, will discuss limits 
		# and filters moving forward
		return all_matches[0:5]


	# tags input taken as a list of tags
	def updateProductSearchTags(self, tags):
		old_tags = ProductTag.query.filter_by(product_id = self.product_id).all()
		for old_tag in old_tags:
			db.session.delete(old_tag)
		db.session.commit()

		for tag in tags:
			new_tag = ProductTag(self.product_id, tag)
			db.session.add(new_tag)
		db.session.commit()

	# tags input taken as a list of tags
	def updateProductSearchTags(self, tags):
		old_tags = ProductSearchTag.query.filter_by(product_id = self.product_id).all()
		for old_tag in old_tags:
			db.session.delete(old_tag)
		db.session.commit()

		for tag in tags:
			new_tag = ProductSearchTag(self.product_id, tag)
			db.session.add(new_tag)
		db.session.commit()

	# tags input taken as a list of tags
	def updateProductListingTags(self, tags):
		old_tags = ProductListingTag.query.filter_by(product_id = self.product_id).all()
		for old_tag in old_tags:
			db.session.delete(old_tag)
		db.session.commit()

		for tag in tags:
			new_tag = ProductListingTag(self.product_id, tag)
			db.session.add(new_tag)
		db.session.commit()

	# tags input taken as a list of tags
	def updateRelatedProductTags(self, tags):
		old_tags = RelatedProductTag.query.filter_by(product_id = self.product_id).all()
		for old_tag in old_tags:
			db.session.delete(old_tag)
		db.session.commit()

		for tag in tags:
			new_tag = RelatedProductTag(self.product_id, tag)
			db.session.add(new_tag)
		db.session.commit()


	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Price] = self.price
		public_dict[Labels.Category] = self.category
		public_dict[Labels.Description] = self.description
		public_dict[Labels.Manufacturer] = self.manufacturer
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
		public_dict[Labels.ManufacturerLogoId] = self.manufacturer_logo_id
		public_dict[Labels.ShowManufacturerLogo] = self.show_manufacturer_logo
		public_dict[Labels.SaleTextProduct] = self.sale_text_product
		public_dict[Labels.SaleTextHome] = self.sale_text_home
		public_dict[Labels.ManufacturerEmail] = self.manufacturer_email
		public_dict[Labels.ManufacturerFee] = self.manufacturer_fee
		public_dict[Labels.Quadrant1] = self.quadrant1
		public_dict[Labels.Quadrant2] = self.quadrant2
		public_dict[Labels.Quadrant3] = self.quadrant3
		public_dict[Labels.Quadrant4] = self.quadrant4
		
		product_search_tags = ProductSearchTag.query.filter_by(product_id = self.product_id).all()
		related_product_tags = RelatedProductTag.query.filter_by(product_id = self.product_id).all()
		product_listing_tags = ProductListingTag.query.filter_by(product_id = self.product_id).all()
		public_dict[Labels.RelatedProductTags] = ",".join([tag.tag for tag in related_product_tags])
		public_dict[Labels.ProductSearchTags] = ",".join([tag.tag for tag in product_search_tags])
		public_dict[Labels.ProductListingTags] = ",".join([tag.tag for tag in product_listing_tags])

		public_dict[Labels.VariantTypeDescription] = self.variant_type_description
		variants = ProductVariant.query.filter_by(product_id = self.product_id).all()
		public_dict[Labels.Variants] = [variant.toPublicDict() for variant in variants]
		return public_dict

class ProductVariant(db.Model):
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
		 db.session.delete(self)
		 db.session.commit()

	@staticmethod
	def activateVariant(variant_id):
		this_variant = ProductVariant.query.filter_by(variant_id = variant_id).first()
		this_variant.active = True
		db.session.commit()

	@staticmethod
	def deactivateVariant(variant_id):
		this_variant = ProductVariant.query.filter_by(variant_id = variant_id).first()
		this_variant.active = False
		db.session.commit()

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.Inventory] = self.inventory
		public_dict[Labels.VariantType] = self.variant_type
		public_dict[Labels.ProductId] = self.product_id
		public_dict[Labels.VariantId] = self.variant_id
		public_dict[Labels.Active] = self.active
		public_dict[Labels.Price] = self.price
		return public_dict






