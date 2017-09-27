
import time


from ..utility.stripe_api import StripeManager

from api.models.shared_models import db
from api.models.user import User
from api.models.cart import CartItem
from api.models.cart import Cart
from api.models.market_product import MarketProduct
from api.models.market_product import ProductVariant

from api.utility.labels import CartLabels as Labels
from api.utility.jwt_util import JwtUtil
from api.utility.email import EmailLib
from api.models.order import Order
from api.models.order import OrderItem
from api.utility.lob import Lob
from api.utility.labels import ErrorLabels
from api.utility.error import ErrorMessages

class Checkout:
	def checkoutCart(this_user, card_id, address_id):
		address = Lob.getAddressById(address_id)
		if int(address.metadata.get(Labels.AccountId)) != this_user.account_id:
			return {Labels.Success : False, Labels.Error : ErrorMessages.CartCheckoutGeneralError}
		this_cart = Cart(this_user)

		date_created = db.func.current_timestamp()
		record_order_response = Checkout.checkoutRecordOrder(this_user, this_cart, address)
		if record_order_response.get(Labels.Success) == False:
			return record_order_response

		this_order = record_order_response.get(Labels.Order)
		charge_customer_response = Checkout.checkoutChargeCustomer(this_user, this_cart, this_order, card_id, address)
		if charge_customer_response != None:
			return charge_customer_response

		# we commit to database after these 2 steps
		db.session.commit()

		#lastly send the email confirmation (or try to)
		send_email_response = Checkout.checkoutSendEmailConfirmation(this_user, this_cart, this_order, address)
		this_cart.clearCart()
		return send_email_response
			

	def checkoutRecordOrder(this_user,this_cart, address):
		try:
			this_order = Order(this_user, this_cart, address)
			db.session.add(this_order)
			error_result = this_order.addItems(this_user, this_cart, address)
			if error_result:
				db.session.rollback()
				error_result[Labels.CartItem].updateCartQuantity(error_result[Labels.Inventory])
				db.session.commit()
				return {Labels.Success:False,Labels.Error : error_result.get(Labels.Error)}
			return {Labels.Success : True, Labels.Order : this_order}

		except Exception as e:
			EmailLib.notifyUserCheckoutErrorEmail(this_user, this_cart, address, ErrorLabels.Database, str(e))
			return {Labels.Success : False, Labels.Error : ErrorMessages.CartCheckoutGeneralError}

	def checkoutChargeCustomer(this_user, this_cart, this_order, card_id, address):
		total_price = this_cart.toPublicDict(address).get(Labels.TotalPrice)
		if not total_price:
			return {Labels.Success : False, Labels.Error : ErrorMessages.CartCheckoutGeneralError}
		try:
			charge = StripeManager.chargeCustomerCard(this_user, card_id, total_price)
			this_order.updateCharge(charge)
			return None
		except Exception as e:
			EmailLib.notifyUserCheckoutErrorEmail(this_user, this_cart, address, ErrorLabels.Charge, str(e))
			return {Labels.Success: False, Labels.Error: ErrorMessages.CartCheckoutPaymentError}

	def checkoutSendEmailConfirmation(this_user, this_cart, this_order, address):
		try:
			EmailLib.sendPurchaseNotification(this_user, this_cart, address, this_order)
			return {
					Labels.Success : True,
					Labels.User : this_user.toPublicDict(),
					Labels.Order : this_order.toPublicDict()
				}

		except Exception as e:
			EmailLib.notifyUserCheckoutErrorEmail(this_user, this_cart, address, ErrorLabels.Email, str(e))
			return {
					Labels.Success : False,
					Labels.User : this_user.toPublicDict(),
					Labels.Message : ErrorMessages.CartCheckoutEmailError,
					Labels.Order : this_order.toPublicDict()
				}

	def updateCartQuantity(this_user, this_product, this_cart_item, new_num_items):
		try:
			new_num_items = int(new_num_items)
		except:
			return {Labels.Success : False, Labels.Error : ErrorMessages.CartUpdateQuantity}
			
		if not this_product:
			return {Labels.Success : False, Labels.Error : ErrorMessages.CartCheckoutGeneralError}
		if this_product.has_variants:
			variant_id = this_cart_item.get(Labels.VariantId)
			cart_item = CartItem.query.filter_by(account_id = this_user.account_id, product_id = this_product.product_id, variant_id = variant_id).first()
			this_variant = ProductVariant.query.filter_by(variant_id = variant_id, product_id = this_product.product_id).first()

			if new_num_items  > this_variant.inventory:
				return {Labels.Success : False, Labels.Error : ErrorMessages.itemLimit(str(this_variant.inventory))}
			try:
				cart_item.updateCartQuantity(new_num_items)
			except:
				return {Labels.Success : False, Labels.Error : ErrorMessages.CartUpdateQuantity}

		else:
			cart_item = CartItem.query.filter_by(account_id = this_user.account_id, product_id = this_product.product_id).first()
			if new_num_items > min(this_product.num_items_limit, this_product.inventory):
				return {Labels.Success : False, Labels.Error : ErrorMessages.itemLimit(str(min(this_product.num_items_limit, this_product.inventory)))}
			try:
				cart_item.updateCartQuantity(new_num_items)
			except Exception as e:
				return {Labels.Success : False, Labels.Error : ErrorMessages.CartUpdateQuantity}

		return {
					Labels.User : this_user.toPublicDict(),
					Labels.Success: True
				}


