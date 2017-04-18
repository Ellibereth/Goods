from flask import Blueprint, jsonify, request
import time
import base64

from ..utility.stripe_api import StripeManager

from api.models.shared_models import db
from api.models.user import User
from api.models.cart import CartItem
from api.models.cart import Cart
from api.models.market_product import MarketProduct
from api.utility.json_util import JsonUtil
from api.utility.labels import CartLabels as Labels
from api.utility.jwt_util import JwtUtil
from api.utility import email_api 
from api.models.order import Order

cart_api = Blueprint('cart_api', __name__)

# default adds item to cart with num_items = 1
# if the item already exists in the cart, increment the number by 1
@cart_api.route('/addItemToCart', methods = ['POST'])
def addItemToCart():
	account_id = request.json.get(Labels.AccountId)
	product_id = request.json.get(Labels.ProductId)
	if not JwtUtil.validateJwtUser(account_id):
		return JsonUtil.jwt_failure()
	existing_cart_item = CartItem.query.fitler_by(account_id = account_id, product_id = product_id).first()
	if existing_cart_item == None:
		new_cart_item = CartItem(account_id, product_id, num_items = 1)
		db.session.add(new_cart_item)
	else:
		existing_cart_item.num_items = existing_cart_item.num_items + 1
	db.session.commit()
	return JsonUtil.success()

# checkout cart
@cart_api.route('/checkoutCart', methods = ['POST'])
def checkoutCart():
	if not JwtUtil.validateJwtUser(account_id):
		return JsonUtil.jwt_failure()
	account_id = request.json.get(Labels.AccountId)
	this_cart = Cart(account_id)
	price = this_cart.price
	this_user = User.query.fitler_by(account_id = account_id).first()
	# charge this price to the customer via stripe
	charge = StripeManager.chargeCustomer(this_user, price)
	# record this transaction for each product (enabling easier refunds), but group by quantity 
	for cart_item in this_cart.items:
		this_product = MarketProduct.query.filter_by(product_id = cart_item.product_id).first()
		new_order = Order(this_user, this_product, cart_item.num_items)
		db.session.add(new_order)

	# send email confirmations
	email_api.sendPurchaseNotification(this_user, this_cart)
	
	# clear the cart
	this_cart.clearCart()
	return JsonUtil.success()


	