from flask import Blueprint, jsonify, request
import time
import base64

from ..utility.stripe_api import StripeManager
from ..utility.order_manager import OrderManager
from ..utility.table_names import ProdTables

from api.models.shared_models import db
from api.models.order import Order
from api.models.user import User
from api.models.market_product import MarketProduct
from api.utility.json_util import JsonUtil
from api.utility.labels import PaymentLabels as Labels
from api.utility.jwt_util import JwtUtil




payment_api = Blueprint('payment_api', __name__)

# this handles a charge for a single object 
# sort of like a buy now option
@payment_api.route('/acceptStripePayment', methods = ['POST'])
def acceptStripePayment():
	# Token is created using Stripe.js or Checkout!
	# Get the payment token submitted by the form:
	jwt = request.json.get(Labels.Jwt)
	token = request.json.get(Labels.StripeToken) 
	product_id = request.json.get(Labels.ProductId)
	account_id = request.json.get(Labels.AccountId)
	this_product = MarketProduct.query.filter_by(product_id = product_id)
	this_user = User.query.filter_by(account_id = account_id).first()
	if this_user == None:
		return JsonUtil.failure("User does not exist")
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	charge = StripeManager.chargeCustomer(this_user, this_product.price)
	new_order = Order(user, this_product, charge, num_items = 1)
	db.session.add(new_order)
	db.session.commit()
	return JsonUtil.success()

@payment_api.route('/getAllOrders', methods = ['POST'])
def getAllOrders():
	jwt = request.json.get(Lables.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	all_orders = Order.query.all()
	output_list = list()
	for order in all_orders:
		output_list.append(order.toPublicDict())
	return jsonify(output_list)


@payment_api.route('/getUserOrders', methods = ['POST'])
def getUserOrders():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	
	this_user_orders = Order.query.filter_by(account_id = account_id).all()
	output_list = list()
	for order in this_user_orders:
		output_list.append(order.toPublicDict())
	return jsonify(output_list)

