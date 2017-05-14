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
	all_products = MarketProduct.query.all()

	name_filter = [product for product in all_products if product.name]
	name_filter = [product for product in name_filter if search_input.lower() in product.name.lower()]

	description_filter = [product for product in name_filter if product.name]
	description_filter = [product for product in description_filter if search_input.lower() in product.name.lower()]

	manufacturer_filter = [product for product in description_filter if product.name]
	manufacturer_filter = [product for product in manufacturer_filter if search_input.lower() in product.name.lower()]

	story_text_filter = [product for product in manufacturer_filter if product.name]
	story_text_filter = [product for product in story_text_filter if search_input.lower() in product.name.lower()]

	filtered_products = [product.toPublicDict() for product in story_text_filter]

	return JsonUtil.successWithOutput({
			Labels.Products : filtered_products
		})



