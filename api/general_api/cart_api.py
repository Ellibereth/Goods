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
from api.utility.checkout import Checkout

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
	checkout_cart_response = Checkout.checkoutCart(this_user, card_id, address_id)
	if checkout_cart_response.get(Labels.Success):
		return JsonUtil.successWithOutput(checkout_cart_response)
	else:
		return JsonUtil.failureWithOutput(checkout_cart_response)

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
	update_cart_quantity_response = Checkout.updateCartQuantity(this_user, this_product, this_cart_item, new_num_items)
	if update_cart_quantity_response.get(Labels.Success):
		return JsonUtil.successWithOutput(update_cart_quantity_response)
	else:
		return JsonUtil.failureWithOutput(update_cart_quantity_response)

@cart_api.route('/refreshCheckoutInfo', methods = ['POST'])
@decorators.check_user_jwt
def refreshCheckoutInfo(this_user):
	address = request.json.get(Labels.Address)
	return JsonUtil.successWithOutput({
			Labels.Jwt : JwtUtil.create_jwt(this_user.toJwtDict()),
			Labels.User : this_user.toPublicDictCheckout(address)
		})





