from flask import Blueprint, jsonify, request
import time
import base64
from api.models.shared_models import db
from api.models.market_product import MarketProduct
from api.utility.json_util import JsonUtil
from api.utility.labels import SearchLabels as Labels
from api.utility.jwt_util import JwtUtil

search_api = Blueprint('search_api', __name__)

@search_api.route('/searchProducts', methods = ['POST'])
def searchProducts():
	search_input = request.json.get(Labels.SearchInput)
	if not search_input:
		return JsonUtil.successWithOutput({
			Labels.Products : []
		})

	# right now this queries all then filters
	# will be updated to adjust the query in the 
	# future when our search criteria is more formalized
	search_input = search_input.lower()

	name_filter = MarketProduct.query.filter(MarketProduct.name.ilike("%" + search_input + "%")).all()
	tag_filter = MarketProduct.getProductsBySearchTag(search_input)

	merged_list = name_filter  + tag_filter
	hit_product_ids = list()
	all_matches = list()
	for product in merged_list:
		if product.product_id not in hit_product_ids:
			all_matches.append(product.toPublicDict(get_related_products = False))
			hit_product_ids.append(product.product_id)
			
	return JsonUtil.successWithOutput({
			Labels.Products : all_matches
		})



