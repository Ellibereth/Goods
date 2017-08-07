
import datetime
"""
This will include all our discount codes
"""

# discount_id = db.Column(db.String, primary_key = True)
# date_limit  = db.Column(db.DateTime)

class DiscountCode:
	def __init__(self, discount_code):
		if discount_code == "EDGAR":
			self.discount_code = "EDGAR"
			self.free_shipping = True
			self.item_discount = 0
			self.discount_message = ""
		else:
			self.discount_code = ""
			self.free_shipping = False
			self.item_discount = 0
			self.discount_message = ""

	def toPublicDict(self):
		public_dict = {}
		public_dict['free_shipping'] = self.free_shipping
		public_dict['item_discount'] = self.item_discount
		public_dict['discount_message'] = self.discount_message
		return public_dict




		
