from flask import Blueprint, jsonify, request
import time
import base64

from ..utility.stripe_api import StripeManager

from api.models.shared_models import db
from api.models.user import User
from api.models.cart import CartItem
from api.models.cart import Cart
from api.models.market_product import MarketProduct
from api.models.market_product import ProductVariant
from api.utility.json_util import JsonUtil
from api.utility.labels import CartLabels as Labels
from api.utility.jwt_util import JwtUtil
from api.utility import email_api 
from api.models.order import Order
from api.models.order import OrderItem
from api.utility.lob import Lob
from api.utility.labels import ErrorLabels
from api.utility.error import ErrorMessages
from api.general_api import decorators 

cart_api = Blueprint('cart_api', __name__)

# default adds item to cart with num_items = 1
# if the item already exists in the cart, increment the number by 1
# might need to modularize this a little bit
@cart_api.route('/addItemToCart', methods = ['POST'])
@decorators.check_user_jwt
def addItemToCart(this_user):
	product_id = request.json.get(Labels.ProductId)
	quantity = int(request.json.get(Labels.Quantity))
	variant = request.json.get(Labels.Variant)
	if variant:
		variant_id = variant.get(Labels.VariantId)
	else:
		variant_id = None
		
	add_to_cart_response = this_user.addItemToCart(product_id, quantity, variant_id)
	if add_to_cart_response.get(Labels.Success):
		return JsonUtil.successWithOutput(add_to_cart_response)
	else:
		return JsonUtil.failureWithOutput(add_to_cart_response)
	

# checkout cart
@cart_api.route('/checkoutCart', methods = ['POST'])
@decorators.check_user_jwt
def checkoutCart(this_user):
	card_id = request.json.get(Labels.CardId)
	address_id = request.json.get(Labels.AddressId)
	address = Lob.getAddressById(address_id)
	if int(address.metadata.get(Labels.AccountId)) != this_user.account_id:
		return JsonUtil.failure(ErrorMessages.AddressUserMismatch)
	this_cart = Cart(this_user.account_id)
	total_price = this_cart.toPublicDict(address).get(Labels.TotalPrice)
	if not total_price:
		return JsonUtil.failure(ErrorMessages.CartPriceCalculationError)
	date_created = db.func.current_timestamp()
	try:
		this_order = Order(this_user, this_cart, address)
		db.session.add(this_order)
		error_result = this_order.addItems(this_user, this_cart, address)
		if error_result:
			db.session.rollback()
			error_result[Labels.CartItem].updateCartQuantity(error_result[Labels.Inventory])
			db.session.commit()
			return JsonUtil.failure(error_result.get(Labels.Error))

	except Exception as e:
		email_api.notifyUserCheckoutErrorEmail(this_user, this_cart, address, ErrorLabels.Database, str(e))
		return JsonUtil.failure(ErrorMessages.CartCheckoutGeneralError)

	# charge this price to the customer via stripe
	# stripe automatically checks if the card matches the customer 
	try:
		charge = StripeManager.chargeCustomerCard(this_user, card_id, total_price)
		this_order.updateCharge(charge)
	except Exception as e:
		email_api.notifyUserCheckoutErrorEmail(this_user, this_cart, address, ErrorLabels.Charge, str(e))
		return JsonUtil.failure(ErrorMessages.CartCheckoutPaymentError)
	db.session.commit()
	email_error = False
	try:
		email_api.sendPurchaseNotification(this_user, this_cart, address, this_order.order_id)
	except Exception as e:
		email_api.notifyUserCheckoutErrorEmail(this_user, this_cart, address, ErrorLabels.Email, str(e))
		email_error = True

	this_cart.clearCart()
	if email_error:
		return JsonUtil.successWithOutput({
				Labels.User : this_user.toPublicDict(),
				Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict()),
				Labels.Message : ErrorMessages.CartCheckoutEmailError
			})
	else:
		return JsonUtil.successWithOutput({
				Labels.User : this_user.toPublicDict(),
				Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict())
			})


@cart_api.route('/getUserCart', methods = ['POST'])
@decorators.check_user_jwt
def getUserCart(this_user):
	this_cart = Cart(this_user.account_id)
	total_price = this_cart.total_price
	return JsonUtil.success(Labels.Cart, this_cart.toPublicDict())


@cart_api.route('/getCheckoutInformation', methods = ['POST'])
@decorators.check_user_jwt
def getCheckoutInformation(this_user):
	this_cart = Cart(this_user.account_id)
	addresses = this_user.getAddresses()
	cards = this_user.getCreditCards()
	return JsonUtil.successWithOutput({Labels.Addresses : addresses, Labels.Cards : cards, 
		Labels.Cart : this_cart.toPublicDict()})


@cart_api.route('/updateCartQuantity', methods = ['POST'])
@decorators.check_user_jwt
def updateCartQuantity(this_user):
	this_cart_item = request.json.get(Labels.CartItem)
	product_id = this_cart_item.get(Labels.ProductId)
	new_num_items = int(request.json.get(Labels.NewNumItems))
	this_product = MarketProduct.query.filter_by(product_id = product_id).first()
	if not this_product:
		return JsonUtil.failure(ErrorMessages.InvalidProduct)
	if this_product.has_variants:
		variant_id = this_cart_item.get(Labels.VariantId)
		cart_item = CartItem.query.filter_by(account_id = this_user.account_id, product_id = product_id, variant_id = variant_id).first()
		this_variant = ProductVariant.query.filter_by(variant_id = variant_id, product_id = product_id).first()

		if new_num_items  > this_variant.inventory:
			return JsonUtil.failure(ErrorMessages.itemLimit(str(this_variant.inventory)))
		try:
			cart_item.updateCartQuantity(new_num_items)
		except:
			return JsonUtil.failure(ErrorMessages.CartUpdateQuantity)

	else:
		cart_item = CartItem.query.filter_by(account_id = this_user.account_id, product_id = product_id).first()
		if new_num_items > min(this_product.num_items_limit, this_product.inventory):
			return JsonUtil.failure(ErrorMessages.itemLimit(str(min(this_product.num_items_limit, this_product.inventory))))
		try:
			cart_item.updateCartQuantity(new_num_items)
		except Exception as e:
			return JsonUtil.failure(ErrorMessages.CartUpdateQuantity)

	return JsonUtil.successWithOutput({
				Labels.User : this_user.toPublicDict(),
				Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict())
			})	

@cart_api.route('/refreshCheckoutInfo', methods = ['POST'])
@decorators.check_user_jwt
def refreshCheckoutInfo(this_user):
	address = request.json.get(Labels.Address)
	return JsonUtil.successWithOutput({
			Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict()),
			Labels.User : this_user.toPublicDictCheckout(address)
		})





