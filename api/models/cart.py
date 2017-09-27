"""
: Module containing Edgar USA user shopping cart 
: and cart item classes
"""

from api.utility.table_names import ProdTables
from api.utility.membership_tiers import MembershipDiscount
from api.utility.labels import CartLabels as Labels
from api.pricing.pricing import Pricing
from api.models.shared_models import db
from api.models.market_product import MarketProduct

SALES_TAX_RATE = 0.05

class Cart:
	"""
	: User cart class. Implemented primarily as a list of CartItem objects
	: Also contains other user information needed for checkout
	"""
	def __init__(self, user, discount_code = None):
		self.account_id = user.account_id
		#  put the cart items in date modified reverse order
		cart_items = CartItem.query.filter(CartItem.account_id == user.account_id).order_by(CartItem.date_modified).all()
		self.items = []
		for cart_item in cart_items:
			this_product = MarketProduct.query.filter_by(product_id = cart_item.product_id).first()
			if this_product.isAvailable():
				self.items.append(cart_item)
		self.membership_tier = user.membership_tier
		self.items_price = self.getCartItemsPrice()
		self.discount_code = discount_code

	def getCartItemsPrice(self):
		"""
		: Calculates this cart's items price after discounts
		"""
		return Pricing.getCartItemsPrice(self)

	def getCartShippingPrice(self, address):
		"""
		: Calculates this cart's shipping price after discounts
		"""
		return Pricing.getCartShippingPrice(self, address)

	def getOriginalCartItemsPrice(self):
		"""
		: Calculates this cart's price of items before discounts are applied
		"""
		return Pricing.getOriginalCartItemsPrice(self)

	def getOriginalShippingPrice(self, address):
		"""
		: Calculates this cart's shipping price before discounts are applied
		"""
		return Pricing.getOriginalCartShippingPrice(self, address)

	def getOriginalCartTotalPrice(self, address):
		"""
		: Calculates this cart's total price before discounts are applied
		"""
		return int(self.getOriginalShippingPrice(address) \
			+ self.getCartSalesTaxPrice(address) + self.getOriginalCartItemsPrice())

	def getSalesTaxRate(self, address):
		"""
		: Calculates this carts sales tax rate based on the address
		"""
		if address[Labels.AddressState] == "CA" or address[Labels.AddressState] == "TX":
			return SALES_TAX_RATE
		else:
			return 0

	def getCartSalesTaxPrice(self, address):
		"""
		: Calculates this carts sales tax price as a product of the tax rate
		"""
		if address is None:
			return 0
		return int(self.getSalesTaxRate(address) * self.getCartItemsPrice())

	def getCartTotalPrice(self, address):
		"""
		: Returns the carts total price after discounts are applied
		"""
		return int(self.getCartShippingPrice(address) \
			+ self.getCartSalesTaxPrice(address) + self.items_price)

	def clearCart(self):
		"""
		: Empties the user's cart by deleting each CartItem object
		: from the database 
		"""
		for cart_item in self.items:
			cart_item.deleteItem()
		self.items = list()

	def getCartSize(self):
		"""
		: Returns the sum of items in the cart
		"""
		total = 0
		for item in self.items:
			total = total + item.num_items
		return total

	def toPublicDict(self, address = None):
		"""
		: Returns a public dictinary of the Cart object
		: Calculates in a discount if necessary
		"""
		public_dict = {}
		product_list = list()
		for cart_item in self.items:
			if cart_item.num_items > 0:
				db_product = MarketProduct.query.filter_by(product_id = cart_item.product_id).first()
				product = db_product.toPublicDict()
				product[Labels.NumItems] = cart_item.num_items
				product[Labels.VariantType] = cart_item.variant_type
				product[Labels.VariantId] = cart_item.variant_id
				product[Labels.DateModified] = cart_item.date_modified
				if cart_item.variant_type != None:
					product[Labels.Name] = product[Labels.Name]  + " - " + cart_item.variant_type
					this_variant = db_product.getProductVariant(cart_item.variant_id)
					product[Labels.Inventory] = this_variant.inventory
				product_list.append(product)
		product_list.sort(key=lambda x: x.get(Labels.DateModified))
		product_list.reverse()
		public_dict[Labels.Items] = product_list
		public_dict[Labels.ItemsPrice] = self.getCartItemsPrice()
		public_dict[Labels.MembershipTier] = self.membership_tier
		public_dict[Labels.OriginalItemsPrice] = self.getOriginalCartItemsPrice()
		public_dict[Labels.ItemsDiscount] = public_dict[Labels.OriginalItemsPrice] - public_dict[Labels.ItemsPrice]
		# here a discount is applied
		public_dict[Labels.Discounts] = public_dict[Labels.ItemsDiscount]
		if address:
			if self.getCartTotalPrice(address) != self.getOriginalCartTotalPrice(address):
				public_dict[Labels.DiscountMessage] = MembershipDiscount(self.membership_tier).discount_message
				public_dict[Labels.OriginalShippingPrice] = self.getOriginalShippingPrice(address)
				public_dict[Labels.ShippingPrice] = self.getCartShippingPrice(address)
				public_dict[Labels.SalesTaxPrice] = self.getCartSalesTaxPrice(address)
				public_dict[Labels.TotalPrice] = self.getCartTotalPrice(address)
				public_dict[Labels.ShippingDiscount] = public_dict[Labels.OriginalShippingPrice] - public_dict[Labels.ShippingPrice]
				public_dict[Labels.Discounts] = public_dict[Labels.Discounts] + public_dict[Labels.ShippingDiscount]
			else:
				public_dict[Labels.TotalPrice] = self.getCartTotalPrice(address)
				public_dict[Labels.ShippingPrice] = self.getCartShippingPrice(address)
				public_dict[Labels.SalesTaxPrice] = self.getCartSalesTaxPrice(address)

		return public_dict
	
class CartItem(db.Model):
	"""
	: this model represents items in a user's shopping cart
	: implemented as a SQLAlchemy model
	: Each CartItem is linked to a single User object via account_id
	"""
	__tablename__ = ProdTables.ShoppingCartTable
	cart_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	account_id = db.Column(db.Integer, db.ForeignKey(ProdTables.UserInfoTable + '.' + Labels.AccountId))
	product_id = db.Column(db.Integer, db.ForeignKey(ProdTables.MarketProductTable + '.' + Labels.ProductId))
	num_items = db.Column(db.Integer)
	num_items_limit = db.Column(db.Integer)
	variant_id = db.Column(db.Integer)
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

	
	def updateCartQuantity(self, new_num_items):
		"""
		: Updates the quantity of this cart item
		: raises exception if the argument new_num_items 
		: is larger than the limit for this product
		: called with a try statement
		"""
		# confirm num_items is an integer
		assert new_num_items >= 0
		assert new_num_items % 1 == 0
		if new_num_items == 0:
			self.deleteItem()
		elif new_num_items > self.num_items_limit:
			raise Exception("You've reached your limit for this product (" + str(self.num_items_limit) + "). You are now at your limit.")
		else:
			self.num_items = new_num_items
		db.session.commit()

	def deleteItem(self):
		"""
		: Deletes this item from the user's cart
		"""
		CartItem.query.filter_by(cart_id = self.cart_id).delete()
		db.session.commit()

	def toPublicDict(self):
		"""
		: Returns a public dictionary of this CartItem object
		"""
		public_dict = {}
		public_dict[Labels.CartId] = self.cart_id
		public_dict[Labels.NumItems] = self.num_items
		public_dict[Labels.ProductId] = self.product_id
		public_dict[Labels.AccountId] = self.account_id
		public_dict[Labels.NumItemsLimit] = min(self.num_items_limit, self.num_items)
		public_dict[Labels.VariantId] = self.variant_id
		public_dict[Labels.DateModified] = self.date_modified
		return public_dict
