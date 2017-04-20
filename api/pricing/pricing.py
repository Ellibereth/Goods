# will compute the prices of a cart once we have an algorithm
# will take into consideration shipping, packaging, etc

from api.models.market_product import MarketProduct 

class Pricing:
	# takes a cart as an object then returns the price of the cart using whatever algorithm we have
	# for now just adds the prices of all the goods 
	def getCartPrice(cart):
		total_price = 0
		for cart_item in cart:
			this_item_price = MarketProduct.query.filter_by(product_id = cart_item.product_id).first().price
			total_price = total_price + this_item_price * cart_item.num_items
		return total_price



