from flask import Blueprint, jsonify, request
import time
import base64

from ..utility.stripe_api import StripeManager

from api.models.shared_models import db
from api.models.market_product import MarketProduct
from api.models.market_product import ProductVariant
from api.utility.json_util import JsonUtil
from api.utility.labels import SearchLabels as Labels
from api.utility.jwt_util import JwtUtil

search_api = Blueprint('search_api', __name__)

@search_api.route('/searchProducts', methods = ['POST'])
def searchProducts():
	search_input = request.json.get(Labels.SearchInput)

	# right now this queries all then filters
	# will be updated ot adjust the query in the 
	# future when our search criteria is more formalized
	all_products = MarketProduct.query.filter_by(active = True).all()

	name_filter = [product for product in all_products if product.name]
	name_filter = [product for product in name_filter if search_input.lower() in product.name.lower()]

	description_filter = [product for product in all_products if product.description]
	description_filter = [product for product in description_filter if search_input.lower() in product.description.lower()]

	manufacturer_filter = [product for product in all_products if product.manufacturer]
	manufacturer_filter = [product for product in manufacturer_filter if search_input.lower() in product.manufacturer.lower()]

	merged_list = name_filter + description_filter + manufacturer_filter
	hit_product_ids = list()
	all_matches = list()
	for product in merged_list:
		if product.product_id not in hit_product_ids:
			all_matches.append(product.toPublicDict())
			hit_product_ids.append(product.product_id)
	return JsonUtil.successWithOutput({
			Labels.Products : all_matches
		})



