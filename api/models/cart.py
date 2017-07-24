from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from passlib.hash import argon2
from api.models.shared_models import db
import time
from api.utility.labels import CartLabels as Labels
from api.pricing.pricing import Pricing
from api.models.market_product import MarketProduct
from api.models.discount_code import DiscountCode
from api.utility.membership_tiers import MembershipDiscount
# this class should be a user's shopping cart
# as a list of CartItems
class Cart:
	def __init__(self, user):
		self.account_id = user.account_id
		self.items = CartItem.query.filter(CartItem.account_id == user.account_id,
				 CartItem.num_items > 0).all()
		self.membership_tier = user.membership_tier
		self.items_price = self.getCartItemsPrice()
		

	def getCartItemsPrice(self):
		return Pricing.getCartItemsPrice(self)

	def getCartShippingPrice(self, address):
		return Pricing.getCartShippingPrice(self, address)

	def getOriginalCartItemsPrice(self):
		return Pricing.getOriginalCartItemsPrice(self)

	def getOriginalShippingPrice(self, address):
		return Pricing.getOriginalCartShippingPrice(self, address)

	def getOriginalCartTotalPrice(self, address):
		return int(self.getOriginalShippingPrice(address) \
			+ self.getCartSalesTaxPrice(address) + self.getOriginalCartItemsPrice())

	def getSalesTaxRate(self, address):
		SALES_TAX_RATE = 0.05
		if address[Labels.AddressState] == "CA" or address[Labels.AddressState] == "TX":
			return SALES_TAX_RATE
		else:
			return 0

	def getCartSalesTaxPrice(self, address):
		if address == None:
			return 0
		return int(self.getSalesTaxRate(address) * self.getCartItemsPrice())

	def getCartTotalPrice(self, address):
		return int(self.getCartShippingPrice(address) \
			+ self.getCartSalesTaxPrice(address) + self.items_price)

	def clearCart(self):
		for cart_item in self.items:
			cart_item.deleteItem()
		self.items = list()
		self.price = 0

	def getCartSize(self):
		total = 0
		for item in self.items:
			total = total + item.num_items
		return total

	def toPublicDict(self, address = None):
		public_dict = {}
		product_list = list()
		for cart_item in self.items:
			if cart_item.num_items > 0:
				db_product = MarketProduct.query.filter_by(product_id = cart_item.product_id).first()
				product = db_product.toPublicDict()
				product[Labels.NumItems] = cart_item.num_items
				product[Labels.VariantType] = cart_item.variant_type
				product[Labels.VariantId] = cart_item.variant_id
				if cart_item.variant_type != None:
					product[Labels.Name] = product[Labels.Name]  + " - " + cart_item.variant_type
					this_variant = db_product.getProductVariant(cart_item.variant_id)
					product[Labels.Inventory] = this_variant.inventory
				product_list.append(product)
		product_list.sort(key=lambda x: x[Labels.Name])
		public_dict[Labels.Items] = product_list
		
		public_dict[Labels.ItemsPrice] = self.getCartItemsPrice()
		public_dict[Labels.MembershipTier] = self.membership_tier

		# here a discount is applied
		

		if address:
			if self.getCartTotalPrice(address) != self.getOriginalCartTotalPrice(address):
				public_dict[Labels.DiscountMessage] = MembershipDiscount(self.membership_tier).discount_message
				
				public_dict[Labels.ShippingPrice] = self.getCartShippingPrice(address)
				public_dict[Labels.SalesTaxPrice] = self.getCartSalesTaxPrice(address)
				public_dict[Labels.TotalPrice] = self.getCartTotalPrice(address)

		return public_dict

	
class CartItem(db.Model):
	__tablename__ = ProdTables.ShoppingCartTable
	cart_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	account_id = db.Column(db.Integer, db.ForeignKey(ProdTables.UserInfoTable + '.' + Labels.AccountId))
	product_id = db.Column(db.Integer, db.ForeignKey(ProdTables.MarketProductTable + '.' + Labels.ProductId))
	num_items = db.Column(db.Integer)
	num_items_limit = db.Column(db.Integer)
	variant_id = db.Column(db.String)
	variant_type = db.Column(db.String)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, account_id, product_id, num_items, variant_id = None, variant_type = None):
		self.account_id = account_id
		self.product_id = product_id
		self.num_items = num_items
		self.variant_id = variant_id
		self.variant_type = variant_type
		self.num_items_limit = MarketProduct.query.filter_by(product_id = product_id).first().num_items_limit
		db.Model.__init__(self)		


	# called with a try statement
	def updateCartQuantity(self, new_num_items):
		# confirm num_items is an integer
		assert(new_num_items >= 0)
		assert(new_num_items % 1 == 0)
		if new_num_items == 0:
			self.deleteItem()
		elif new_num_items > self.num_items_limit:
			raise Exception("You've reached your limit for this product (" + str(self.num_items_limit) + "). You are now at your limit.")
		else:
			self.num_items = new_num_items
		db.session.commit()

	def deleteItem(self):
		CartItem.query.filter_by(cart_id = self.cart_id).delete()
		db.session.commit()

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.CartId] = self.cart_id
		public_dict[Labels.NumItems] = self.num_items
		public_dict[Labels.ProductId] = self.product_id
		public_dict[Labels.AccountId] = self.account_id
		public_dict[Labels.NumItemsLimit] = min(self.num_items_limit, self.num_items)
		public_dict[Labels.VariantId] = self.variant_id
		return public_dict




