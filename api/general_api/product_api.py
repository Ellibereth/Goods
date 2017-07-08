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



@product_api.route('/getOnSaleProducts', methods = ['POST'])
def getOnSaleProducts():
	sale_products = MarketProduct.query.filter(MarketProduct.active and MarketProduct.sale_price != None).all()
	return JsonUtil.successWithOutput({
			Labels.Products :  [sale_product.toPublicDict() for sale_product in sale_products]
		})



