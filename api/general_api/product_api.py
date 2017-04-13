import datetime
from flask import Blueprint, jsonify, request
from api.utility.table_names import ProdTables
from api.utility.labels import MarketProductLabels as Labels

from api.utility.json_util import JsonUtil
from api.s3.s3_api import S3

from api.models.shared_models import db
from api.models.market_product import MarketProduct
from api.models.product_tags import ProductTag
from api.models.product_image import ProductImage


product_api = Blueprint('product_api', __name__)

@product_api.route('/addMarketProduct', methods = ['POST'])
def addMarketProduct():
	market_product = request.json.get(Labels.MarketProduct)
	if market_product == None:
		return JsonUtil.failure("Invalid submission")
	name = market_product.get(Labels.Name)
	try:
		print(market_product.get(Labels.Price))
		price = float(market_product.get(Labels.Price))
	except:
		return JsonUtil.failure("Price is not a valid float")
	category = market_product.get(Labels.Category)
	description = market_product.get(Labels.Description)
	manufacturer = market_product.get(Labels.Manufacturer)
	inventory = market_product.get(Labels.Inventory)
	sale_end_date_string = market_product.get(Labels.SaleEndDate)
	"2018-08-29T21:09"
	date_format = '%Y-%m-%dT%H:%M'
	sale_end_date = datetime.datetime.strptime(sale_end_date_string, date_format)
	new_product = MarketProduct(name, price, category, description, manufacturer, inventory, sale_end_date)
	db.session.add(new_product)
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
	market_products = MarketProduct.query.all()
	output = list()
	for product in market_products:
		output.append(product.toPublicDict())
	print(output)
	return jsonify(output)


@product_api.route('/getMarketProductInfo', methods = ['POST'])
def getMarketProductInfo():
	product_id = request.json.get(Labels.ProductId)
	market_product = MarketProduct.query.filter_by(product_id = product_id)
	if market_product == None:
		return JsonUtil.failure("Error retrieving product information")
	else:
		return JsonUtil.success(Labels.Product, market_product)

@product_api.route('/uploadMarketProductImage', methods = ['POST'])
def uploadMarketProductImage():
	## yes Ben I know this is a magic string / hard coded
	## tell me how to make this better!
	product_id = request.json.get(Labels.ProductId)
	image_data = request.json.get(Labels.ImageData)
	image_bytes = image_data.encode('utf-8')
	image_decoded = base64.decodestring(image_bytes)

	# increment the number of images for the product
	this_product = MarketProduct.query.filter_by(product_id = product_id)
	this_product.num_images = this_product.num_images + 1
	db.session.add(this_product)

	# record the image_id in the database
	image_record = ProductImage()
	db.session.add(image_record)
	# upload the image to S3
	S3.uploadProductImage(image_record.image_id, image_decoded)

	# commit to database
	db.session.commit()
	return JsonUtil.success()


