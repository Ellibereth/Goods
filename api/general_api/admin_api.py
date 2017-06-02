from flask import Blueprint, jsonify, request
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil
from api.security.tracking import LoginAttempt
from api.utility.labels import MarketProductLabels as Labels
from api.models.shared_models import db
from api.models.admin_user import AdminUser
from api.models.home_image import HomeImage
from api.models.market_product import MarketProduct
from api.security.tracking import AdminAction
from api.models.market_product import ProductVariant

import base64
from api.s3.s3_api import S3



	
admin_api = Blueprint('admin_api', __name__)
admin_login_username = "heathcliffe"
admin_login_password = "powerplay"



# this route needs to be udpdated for when we have admin accounts
@admin_api.route('/checkAdminLogin', methods =['POST'])
def checkAdminLogin():	
	ip = request.remote_addr
	username = request.json.get(Labels.Username)
	password = request.json.get(Labels.Password)
	if AdminUser.checkLogin(username, password):
		admin_user = AdminUser.query.filter_by(username = username).first()
		admin_jwt = JwtUtil.create_jwt(admin_user.toPublicDict())
		LoginAttempt.addLoginAttempt(username, ip 
			, success = True, is_admin = True)
		return JsonUtil.successWithOutput({
			Labels.User : admin_user.toPublicDict(), 
			"jwt" : admin_jwt})
	else:
		LoginAttempt.addLoginAttempt(username, ip, success = False, is_admin = True)
		return JsonUtil.failure("Invalid Credentials")

@admin_api.route('/checkAdminJwt', methods =['POST'])
def checkAdminJwt():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()
	else:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
		return JsonUtil.success()


@admin_api.route('/uploadMarketProductImage', methods = ['POST'])
def uploadMarketProductImage():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	image_data = request.json.get(Labels.ImageData)
	if image_data == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("No image has been uploaded!")
	image_bytes = image_data.encode('utf-8')
	image_decoded = base64.decodestring(image_bytes)


	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		return JsonUtil.failure("Product doesn't exist")
	this_product.addProductImage(image_decoded)
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success()

@admin_api.route('/deleteProductPhoto', methods = ['POST'])
def deleteProductPhoto():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	image_id = request.json.get(Labels.ImageId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Error retrieving product information")

	this_image = ProductImage.query.filter_by(image_id = image_id).first()
	if this_image == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Error retrieving image")
	this_image.soft_deleted = True
	db.session.commit()
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success(Labels.Product, this_product.toPublicDict())


@admin_api.route('/updateProductInfo', methods = ['POST'])
def updateProductInfo():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	product = request.json.get(Labels.Product)
	name = request.json.get(Labels.Name)

	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("There was no input")
	if this_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
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
			AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
			return JsonUtil.failure("Item limit is not integer")
	if story_template != None:
		try:
			this_product.story_template = int(story_template)
		except:
			AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
			return JsonUtil.failure("Story template choice : " + str(story_template) + " is not an integer")
	if product_template != None:
		try:
			this_product.product_template = int(product_template)
		except:
			AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
			return JsonUtil.failure("Product template choice : " + str(product_template) + " is not an integer")
			
	db.session.commit()
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success(Labels.Product, this_product.toPublicDict())



@admin_api.route('/setMainProductPhoto', methods = ['POST'])
def setMainProductPhoto():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	image_id = request.json.get(Labels.ImageId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Error retrieving product information")

	this_image = ProductImage.query.filter_by(image_id = image_id).first()
	if this_image == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Error retrieving image")

	this_product.main_image = image_id
	db.session.commit()
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success(Labels.Product, this_product.toPublicDict())



@admin_api.route('/activateProduct', methods = ['POST'])
def activateProduct():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	product = MarketProduct.query.filter_by(product_id = product_id).first()
	if product:
		product.activateProduct()
	else:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("product doesn't exist")
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success("Successfully activated \'" + product.name)

@admin_api.route('/deactivateProduct', methods = ['POST'])
def deactivateProduct():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	product = MarketProduct.query.filter_by(product_id = product_id).first()
	if product:
		product.deactivateProduct()
	else:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("product doesn't exist")

	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success("Successfully activated \'" + product.name)

@admin_api.route('/getAdminMarketProductInfo', methods = ['POST'])
def getAdminMarketProductInfo():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	market_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if market_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Error retrieving product information")
	else:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
		return JsonUtil.success(Labels.Product, market_product.toPublicDict())



@admin_api.route('/getMarketProducts', methods = ['POST'])
def getMarketProducts():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	market_products = MarketProduct.getAllProducts()
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return jsonify(market_products)


@admin_api.route('/addProductVariant', methods = ['POST'])
def addProductVariant():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid submission")
	
	variant_type = request.json.get(Labels.VariantType)
	inventory = request.json.get(Labels.Inventory)
	if inventory == None:
		inventory = 10
	price = request.json.get(Labels.Price)
	this_product.addProductVariant(variant_type, price, inventory)

	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.successWithOutput({
			Labels.Product : this_product.toPublicDict()
		})



@admin_api.route('/deleteVariant', methods = ['POST'])
def deleteVariant():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid submission")

	variant_id = request.json.get(Labels.VariantId)
	this_variant = ProductVariant.query.filter_by(variant_id = variant_id).first()
	if not this_variant:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid submission")

	this_variant.delete()

	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success()

@admin_api.route('/updateVariant', methods = ['POST'])
def updateVariant():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid submission")

	variant  = request.json.get(Labels.Variant)	
	if not variant:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid variant")

	this_variant = ProductVariant.query.filter_by(variant_id = variant[Labels.VariantId]).first()
	if not this_variant:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid variant")

	this_variant.updateVariant(variant)
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success()


@admin_api.route('/activateVariant', methods = ['POST'])
def activateVariant():
	jwt = request.json.get(Labels.Jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid submission")

	variant_id = request.json.get(Labels.VariantId)
	ProductVariant.activateVariant(variant_id)
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success()


@admin_api.route('/deactivateVariant', methods = ['POST'])
def deactivateVariant():
	jwt = request.json.get(Labels.Jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid submission")

	variant_id = request.json.get(Labels.VariantId)
	ProductVariant.deactivateVariant(variant_id)
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success()


@admin_api.route('/toggleProductHasVariants', methods = ['POST'])
def toggleProductHasVariants():
	jwt = request.json.get(Labels.Jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	has_variants = request.json.get(Labels.HasVariants)
	if not product_id:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.falure("No product ID")
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if not this_product:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.falure("Product doesn't exist")

	this_product.has_variants = has_variants
	this_product.active = False
	db.session.commit()
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success()

@admin_api.route('/uploadProductStoryImage', methods = ['POST'])
def uploadProductStoryImage():
	jwt = request.json.get(Labels.Jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()
	product_id = request.json.get(Labels.ProductId)

	image_data = request.json.get(Labels.ImageData)
	if image_data == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("No image has been uploaded!")
	image_bytes = image_data.encode('utf-8')
	image_decoded = base64.decodestring(image_bytes)
	# increment the number of images for the product
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if this_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Product doesn't exist")
	this_product.addStoryImage(image_decoded)

	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success()



@admin_api.route('/addMarketProduct', methods = ['POST'])
def addMarketProduct():
	jwt = request.json.get(Labels.Jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()
	market_product = request.json.get(Labels.MarketProduct)
	if market_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid submission")
	name = market_product.get(Labels.Name)
	try:
		price = round(float(market_product.get(Labels.Price)), 2)
	except:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
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
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success()

@admin_api.route('/uploadHomeImage', methods = ['POST'])
def uploadHomeImage():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	image_data = request.json.get(Labels.ImageData)
	if image_data == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("No image has been uploaded!")
	image_bytes = image_data.encode('utf-8')
	image_decoded = base64.decodestring(image_bytes)
	HomeImage.addHomeImage(image_decoded)
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.success()


@admin_api.route('/updateHomeImage', methods = ['POST'])
def updateHomeImage():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	image_id = request.json.get(Labels.ImageId)
	live = request.json.get(Labels.Live)
	image_text = request.json.get(Labels.ImageText)
	if not image_id:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Bad home image input")

	home_image = HomeImage.query.filter_by(image_id = image_id).first()
	if not home_image:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Bad home image input")

	home_image.updateHomeImage(live, image_text)
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
	return JsonUtil.success()

@admin_api.route('/getHomeImages', methods = ['POST'])
def getHomeImages():
	jwt = request.json.get(Labels.Jwt)
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()

	home_images = HomeImage.query.filter_by().all()
	return JsonUtil.successWithOutput({
			Labels.Images : [home_image.toPublicDict() for home_image in home_images]
	})






