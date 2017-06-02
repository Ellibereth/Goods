import datetime
from flask import Blueprint, jsonify, request
from api.utility.table_names import ProdTables
from api.utility.labels import MarketProductLabels as Labels
import base64
from api.utility.json_util import JsonUtil
from api.s3.s3_api import S3
from api.models.shared_models import db
from api.models.market_product import MarketProduct
from api.models.market_product import ProductVariant
from api.models.product_tag import ProductTag
from api.models.product_image import ProductImage
from api.utility.jwt_util import JwtUtil


product_api = Blueprint('product_api', __name__)

@product_api.route('/addMarketProduct', methods = ['POST'])
def addMarketProduct():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	market_product = request.json.get(Labels.MarketProduct)
	if market_product == None:
		return JsonUtil.failure("Invalid submission")
	name = market_product.get(Labels.Name)
	try:
		price = round(float(market_product.get(Labels.Price)), 2)
	except:
		return JsonUtil.failure("Price is not a valid float")
	category = market_product.get(Labels.Category)
	description = market_product.get(Labels.Description)
	manufacturer = market_product.get(Labels.Manufacturer)
	inventory = market_product.get(Labels.Inventory)
	sale_end_date_string = market_product.get(Labels.SaleEndDate)
	date_format = '%Y-%m-%dT%H:%M'
	sale_end_date = datetime.datetime.strptime(sale_end_date_string, date_format)
	has_variants = request.json.get(Labels.HasVariants)
	variant_types = request.json.get(Labels.VariantTypes)
	if has_variants:
		new_product = MarketProduct(name, price, category, description, manufacturer, inventory, sale_end_date, has_variants = True)
		db.session.add(new_product)
		db.session.commit()
		new_product.addProductVariants(variant_types)
	else:
		new_product = MarketProduct(name, price, category, description, manufacturer, inventory, sale_end_date)
		db.session.add(new_product)
		db.session.commit()
	tags = request.json.get(Labels.Tags)
	# add tags here, will change depending on front end input
	# only update tags if adding the product was a success
	if tags != None:
		for tag in tags:
			new_tag = ProductTag(new_product.product_id, tag)
			db.session.add(new_product)
	db.session.commit()
	return JsonUtil.success()

@product_api.route('/getMarketProducts', methods = ['POST'])
def getMarketProducts():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	market_products = MarketProduct.getAllProducts()
	return jsonify(market_products)

@product_api.route('/getMarketProductInfo', methods = ['POST'])
def getMarketProductInfo():
	product_id = request.json.get(Labels.ProductId)
	if not product_id:
		return JsonUtil.failure("Bad Product Id")
	if not product_id.isdigit():
		return JsonUtil.failure("Bad Product Id")
	market_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if market_product == None:
		return JsonUtil.failure("Error retrieving product information")
	else:
		return JsonUtil.success(Labels.Product, market_product.toPublicDict())

@product_api.route('/setMainProductPhoto', methods = ['POST'])
def setMainProductPhoto():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	image_id = request.json.get(Labels.ImageId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		return JsonUtil.failure("Error retrieving product information")

	this_image = ProductImage.query.filter_by(image_id = image_id).first()
	if this_image == None:
		return JsonUtil.failure("Error retrieving image")

	this_product.main_image = image_id
	db.session.commit()
	return JsonUtil.success(Labels.Product, this_product.toPublicDict())

@product_api.route('/deleteProductPhoto', methods = ['POST'])
def deleteProductPhoto():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	image_id = request.json.get(Labels.ImageId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		return JsonUtil.failure("Error retrieving product information")

	this_image = ProductImage.query.filter_by(image_id = image_id).first()
	if this_image == None:
		return JsonUtil.failure("Error retrieving image")
	this_image.soft_deleted = True
	db.session.commit()
	return JsonUtil.success(Labels.Product, this_product.toPublicDict())

@product_api.route('/updateProductInfo', methods = ['POST'])
def updateProductInfo():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	product = request.json.get(Labels.Product)
	name = request.json.get(Labels.Name)

	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if product == None:
		return JsonUtil.failure("There was no input")
	if this_product == None:
		return JsonUtil.failure("Error retrieving product information")
	price = product.get(Labels.Price)
	description = product.get(Labels.Description)
	manufacturer = product.get(Labels.Manufacturer)
	sale_end_date = product.get(Labels.SaleEndDate)
	inventory = product.get(Labels.Inventory)
	story_template = product.get(Labels.StoryTemplate)
	product_template = product.get(Labels.ProductTemplate)
	story_text = product.get(Labels.StoryText)
	num_items_limit = product.get(Labels.NumItemsLimit)
	variant_type_description = product.get(Labels.VariantTypeDescription)
	live = product.get(Labels.Live)
	if live != None:
		this_product.live = live
	if variant_type_description != None:
		this_product.variant_type_description = variant_type_description
	if price != None:
		this_product.price = round(float(price), 2)
	if description != None:
		this_product.description = description
	if manufacturer != None:
		this_product.manufacturer = manufacturer
	if sale_end_date != None:
		this_product.sale_end_date = sale_end_date
	if name != None:
		this_product.name = name
	if inventory != None:
		this_product.inventory = inventory
	if story_text != None:
		this_product.story_text = story_text
	if num_items_limit != None:
		try:
			this_product.num_items_limit = int(num_items_limit)
		except:
			return JsonUtil.failure("Item limit is not integer")
	if story_template != None:
		try:
			this_product.story_template = int(story_template)
		except:
			return JsonUtil.failure("Story template choice : " + str(story_template) + " is not an integer")
	if product_template != None:
		try:
			this_product.product_template = int(product_template)
		except:
			return JsonUtil.failure("Product template choice : " + str(product_template) + " is not an integer")
			
	db.session.commit()
	return JsonUtil.success(Labels.Product, this_product.toPublicDict())




@product_api.route('/activateProduct', methods = ['POST'])
def activateProduct():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	product = MarketProduct.query.filter_by(product_id = product_id).first()
	if product:
		product.activateProduct()
	else:
		return JsonUtil.failure("product doesn't exist")
	return JsonUtil.success("Successfully activated \'" + product.name)

@product_api.route('/deactivateProduct', methods = ['POST'])
def deactivateProduct():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	product = MarketProduct.query.filter_by(product_id = product_id).first()
	if product:
		product.deactivateProduct()
	else:
		return JsonUtil.failure("product doesn't exist")

	return JsonUtil.success("Successfully activated \'" + product.name)

@product_api.route('/getAdminMarketProductInfo', methods = ['POST'])
def getAdminMarketProductInfo():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	market_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if market_product == None:
		return JsonUtil.failure("Error retrieving product information")
	else:
		return JsonUtil.success(Labels.Product, market_product.toPublicDict())

@product_api.route('/uploadProductStoryImage', methods = ['POST'])
def uploadProductStoryImage():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)

	image_data = request.json.get(Labels.ImageData)
	if image_data == None:
		return JsonUtil.failure("No image has been uploaded!")
	image_bytes = image_data.encode('utf-8')
	image_decoded = base64.decodestring(image_bytes)
	# increment the number of images for the product
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		return JsonUtil.failure("Product doesn't exist")
	this_product.addStoryImage(image_decoded)
	
	return JsonUtil.success()


@product_api.route('/addProductVariant', methods = ['POST'])
def addProductVariant():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		return JsonUtil.failure("Invalid submission")
	
	variant_type = request.json.get(Labels.VariantType)
	inventory = request.json.get(Labels.Inventory)
	if inventory == None:
		inventory = 10
	price = request.json.get(Labels.Price)
	this_product.addProductVariant(variant_type, price, inventory)

	return JsonUtil.successWithOutput({
			Labels.Product : this_product.toPublicDict()
		})



@product_api.route('/deleteVariant', methods = ['POST'])
def deleteVariant():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		return JsonUtil.failure("Invalid submission")

	variant_id = request.json.get(Labels.VariantId)
	this_variant = ProductVariant.query.filter_by(variant_id = variant_id).first()
	if not this_variant:
		return JsonUtil.failure("Invalid submission")

	this_variant.delete()

	return JsonUtil.success()

@product_api.route('/updateVariant', methods = ['POST'])
def updateVariant():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		return JsonUtil.failure("Invalid submission")

	variant  = request.json.get(Labels.Variant)	
	if not variant:
		return JsonUtil.failure("Invalid variant")

	this_variant = ProductVariant.query.filter_by(variant_id = variant[Labels.VariantId]).first()
	if not this_variant:
		return JsonUtil.failure("Invalid variant")

	this_variant.updateVariant(variant)

	return JsonUtil.success()


@product_api.route('/activateVariant', methods = ['POST'])
def activateVariant():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		return JsonUtil.failure("Invalid submission")

	variant_id = request.json.get(Labels.VariantId)
	ProductVariant.activateVariant(variant_id)
	return JsonUtil.success()


@product_api.route('/deactivateVariant', methods = ['POST'])
def deactivateVariant():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		return JsonUtil.failure("Invalid submission")

	variant_id = request.json.get(Labels.VariantId)
	ProductVariant.deactivateVariant(variant_id)
	return JsonUtil.success()


@product_api.route('/getBatchedProductInformation', methods = ['POST'])
def getBatchedProductInformation():

	product_id_list = request.json.get(Labels.ProductIdList)
	market_products = MarketProduct.query.filter(MarketProduct.product_id.in_(product_id_list)
		,MarketProduct.active).all()

	return JsonUtil.successWithOutput({
			Labels.Products :  [market_product.toPublicDict() for market_product in market_products]
		})


@product_api.route('/getHomePageProducts', methods = ['POST'])
def getHomePageProducts():
	market_products = MarketProduct.query.filter(MarketProduct.active, MarketProduct.live).all()
	return JsonUtil.successWithOutput({
			Labels.Products :  [market_product.toPublicDict() for market_product in market_products]
		})

@product_api.route('/toggleProductHasVariants', methods = ['POST'])
def toggleProductHasVariants():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	has_variants = request.json.get(Labels.HasVariants)
	if not product_id:
		return JsonUtil.falure("No product ID")
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if not this_product:
		return JsonUtil.falure("Product doesn't exist")

	this_product.has_variants = has_variants
	this_product.active = False
	db.session.commit()
	return JsonUtil.success()



