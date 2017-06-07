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
from api.models.product_image import ProductImage
from api.models.story_image import StoryImage

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
	if LoginAttempt.blockIpAddress(ip):
		LoginAttempt.addLoginAttempt(username, ip, success = False, is_admin = True)
		return JsonUtil.failure("Your IP has been blocked for spamming login attempts. Try again in 15 minutes")

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

	integer_input_labels = ['inventory', 'num_items_limit', 'story_template', 'product_template']
	for key in product.keys():
		try:
			if key == "price":
				value = round(float(product.get(key)), 2)
			elif key in integer_input_labels:
				value = int(product.get(key))
			else:
				value = product.get(key)
			if value:
				setattr(this_product, key, value)
		except:
			AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
			return JsonUtil.failure(key + " input is invalid")

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
	decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
	if not decoded_jwt:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.jwt_failure()
	market_product = request.json.get(Labels.MarketProduct)
	if market_product == None:
		AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
		return JsonUtil.failure("Invalid submission")
	
	name = market_product.get(Labels.Name)
	new_product = MarketProduct(name)
	db.session.add(new_product)
	db.session.commit()
	AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = True)
	return JsonUtil.successWithOutput({
			Labels.Product : new_product.toPublicDict()
		})

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






