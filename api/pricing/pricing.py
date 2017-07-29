# will compute the prices of a cart once we have an algorithm
# will take into consideration shipping, packaging, etc

from api.models.market_product import MarketProduct
from api.utility.membership_tiers import MembershipDiscount

FLAT_SHIPPING_PRICE = 500

class Pricing:

	def getCartItemsTotalPrice(cart):
		total_price = 0
		for cart_item in cart.items:
			this_product = MarketProduct.query.filter_by(product_id = cart_item.product_id).one()
			total_price = total_price + this_product.price * cart_item.num_items

		return total_price


	# takes a cart as an object then returns the price of the cart using whatever algorithm we have
	# for now just adds the prices of all the goods 
	def getOriginalCartItemsPrice(cart):
		return Pricing.getCartItemsTotalPrice(cart)


	def getCartItemsPrice(cart):
		discount = MembershipDiscount(cart.membership_tier)
		items_price = Pricing.getCartItemsTotalPrice(cart)
		if discount.item_discount:
			return int(items_price * (100 - discount.item_discount) / 100)
		else:
			return items_price

	def getOriginalCartShippingPrice(cart, address):
		return FLAT_SHIPPING_PRICE

	def getCartShippingPrice(cart, address):
		# this will be updated to actually take address into account 
		discount = MembershipDiscount(cart.membership_tier)
		if discount.free_shipping:
			return 0
		else:
			return FLAT_SHIPPING_PRICE
		




