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

	# confirm num_items is an integer
	def updateCartItemQuantity(self, product_id, num_items):
		assert(num_items % 1 == 0)
		self.items.query.filter_by(product_id = product_id).first().num_items = num_items
		db.session.commit()

	def clearCart(self):
		self.items.delete()
		db.session.commit()

	def toPublicDict(self):
		product_list = list()
		for cart_item in self.items:
			product = MarketProduct.query.filter_by(product_id = cart_item.product_id).first().toPublicDict()
			product[Labels.NumItems] = cart_item.num_items
			product_list.append(product)
		return product_list

## user object class
class CartItem(db.Model):
	__tablename__ = ProdTables.ShoppingCartTable
	cart_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	account_id = db.Column(db.Integer, db.ForeignKey(ProdTables.UserInfoTable + '.' + Labels.AccountId))
	product_id = db.Column(db.Integer, db.ForeignKey(ProdTables.MarketProductTable + '.' + Labels.ProductId))
	num_items = db.Column(db.Integer)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, account_id, product_id, num_items):
		self.account_id = account_id
		self.product_id = product_id
		self.num_items = num_items
		db.Model.__init__(self)		


	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.CartId] = self.cart_id
		public_dict[Labels.NumItems] = self.num_items
		public_dict[Labels.ProductId] = self.product_id
		public_dict[Labels.AccountId] = self.account_id
		return public_dict




