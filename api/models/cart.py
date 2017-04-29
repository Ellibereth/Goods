from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from passlib.hash import argon2
from api.models.shared_models import db
import time
from api.utility.labels import CartLabels as Labels
from api.pricing.pricing import Pricing
from api.models.market_product import MarketProduct


# this class should be a user's shopping cart
# as a list of CartItems
class Cart:
	def __init__(self, account_id):
		self.account_id = account_id
		self.items = CartItem.query.filter_by(account_id = account_id).all()
		self.price = self.getCartPrice(account_id)

	def getCartPrice(self, account_id):
		return Pricing.getCartPrice(self.items)

	def clearCart(self):
		for cart_item in self.items:
			cart_item.deleteItem()
		self.items = list()
		self.price = 0

	def toPublicDict(self):
		public_dict = {}
		product_list = list()
		for cart_item in self.items:
			product = MarketProduct.query.filter_by(product_id = cart_item.product_id).first().toPublicDict()
			product[Labels.NumItems] = cart_item.num_items
			product[Labels.NumItemsLimit] = cart_item.num_items_limit
			product_list.append(product)
		public_dict[Labels.Items] = product_list
		public_dict[Labels.Price] = self.price
		return public_dict

## user object class
class CartItem(db.Model):
	__tablename__ = ProdTables.ShoppingCartTable
	cart_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	account_id = db.Column(db.Integer, db.ForeignKey(ProdTables.UserInfoTable + '.' + Labels.AccountId))
	product_id = db.Column(db.Integer, db.ForeignKey(ProdTables.MarketProductTable + '.' + Labels.ProductId))
	num_items = db.Column(db.Integer)
	num_items_limit = db.Column(db.Integer)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, account_id, product_id, num_items):
		self.account_id = account_id
		self.product_id = product_id
		self.num_items = num_items
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
			self.num_items = self.num_items_limit
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
		public_dict[Labels.NumItemsLimit] = min(self.num_items_limit, self.inventory)
		return public_dict




