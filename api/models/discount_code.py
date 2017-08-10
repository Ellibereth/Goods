# % Discount on items (Integer as percent)
# Also addes Free Shipping (boolean)
# Time Limit on discount (null if indefinite)
# Usage Limit (null if unlimited)
# Unique_id to go with it (probably 6 digit string)
# Alternate ID to go with, something that makes sense like (EDGAR1) as seen on other sites

from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import DiscountLabels as Labels
from api.utility.id_util import IdUtil
import os

ENVIRONMENT = os.environ.get('ENVIRONMENT')


## user object class
class DiscountCode(db.Model):
	__tablename__ = ProdTables.DiscountTable
	discount_id = db.Column(db.String, primary_key = True)
	discount_code = db.Column(db.String, unique = True)
	date_limit  = db.Column(db.DateTime)
	usage_limit = db.Column(db.Integer)
	free_shipping = db.Column(db.Boolean)

	# this discount should come as an integers as a percent (we'll do whole numbers)
	item_discount = db.Column(db.Integer)


	def __init__(self, discount_code, date_limit, usage_limit, free_shipping):
		self.discount_code = discount_code
		self.date_limit = date_limit
		self.usage_limit = usage_limit
		self.free_shipping = free_shipping
		db.Model.__init__(self)

		




