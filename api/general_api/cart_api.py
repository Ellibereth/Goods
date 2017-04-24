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
from api.utility.lob import Lob

cart_api = Blueprint('cart_api', __name__)

# default adds item to cart with num_items = 1
# if the item already exists in the cart, increment the number by 1
@cart_api.route('/addItemToCart', methods = ['POST'])
def addItemToCart():
	account_id = request.json.get(Labels.AccountId)
	product_id = request.json.get(Labels.ProductId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	cart_item = CartItem.query.filter_by(account_id = account_id, product_id = product_id).first()
	if cart_item == None:
		new_cart_item = CartItem(account_id, product_id, num_items = 1)
		db.session.add(new_cart_item)
		db.session.commit()
		return JsonUtil.success()
	try:
		cart_item.updateCartQuantity(cart_item.num_items + 1)
	except Exception as e:
		return JsonUtil.failure("Something went wrong while adding item to cart " + str(e))
	return JsonUtil.success()

# checkout cart
@cart_api.route('/checkoutCart', methods = ['POST'])
def checkoutCart():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	card_id = request.json.get(Labels.CardId)
	address_id = request.json.get(Labels.AddressId)
	address = Lob.getAddressById(address_id)

	if int(address.metadata[Labels.AccountId]) != account_id:
		return JsonUtil.failure("Address does not go with this user")

	this_cart = Cart(account_id)
	price = this_cart.price
	this_user = User.query.filter_by(account_id = account_id).first()

	# charge this price to the customer via stripe
	# stripe automatically checks if the card matches the customer 
	try:
		charge = StripeManager.chargeCustomerCard(this_user, card_id ,price)
	except Exception as e:
		return JsonUtil.failure("Something went wrong while trying to process payment information " + str(e))

	# record this transaction for each product (enabling easier refunds), but group by quantity 
	for cart_item in this_cart.items:
		this_product = MarketProduct.query.filter_by(product_id = cart_item.product_id).first()
		this_product.inventory = this_product.inventory - cart_item.num_items
		new_order = Order(this_user, this_product, address, charge, cart_item.num_items)
		db.session.add(new_order)
		db.session.commit()

	db.session.commit()
	# send email confirmations
	email_api.sendPurchaseNotification(this_user, this_cart, address)
	
	# # clear the cart
	this_cart.clearCart()
	return JsonUtil.success()


@cart_api.route('/getUserCart', methods = ['POST'])
def getUserCart():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	
	this_cart = Cart(account_id)
	price = this_cart.price
	return JsonUtil.success(Labels.Cart, this_cart.toPublicDict())


@cart_api.route('/getCheckoutInformation', methods = ['POST'])
def getCheckoutInformation():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()
	this_user = User.query.filter_by(account_id = account_id).first()
	if this_user == None:
		return JsonUtil.failure("User does not exist")
	this_cart = Cart(account_id)
	price = this_cart.price
	addresses = this_user.getAddresses()
	cards = this_user.getCreditCards()
	return JsonUtil.successWithOutput({Labels.Addresses : addresses, Labels.Cards : cards, 
		Labels.Cart : this_cart.toPublicDict()})


@cart_api.route('/updateCartQuantity', methods = ['POST'])
def updateCartQuantity():
	account_id = request.json.get(Labels.AccountId)
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtUser(jwt, account_id):
		return JsonUtil.jwt_failure()

	product_id = request.json.get(Labels.ProductId)
	new_num_items = int(request.json.get(Labels.NewNumItems))
	cart_item = CartItem.query.filter_by(account_id = account_id, product_id = product_id).first()
	try:
		cart_item.updateCartQuantity(new_num_items)
	except Exception as e:
		return JsonUtil.failure("Something went wrong while updating cart quantity : " + str(e))
	return JsonUtil.success()


