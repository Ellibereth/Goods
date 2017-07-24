
"""
This will include all our membership tiers 
"""
class MembershipTiers:
	NONE = 0
	TEN_PERCENT_OFF = 1
	MEMBER = 2

	def getMembershipBenefits(tier_level):
		return MembershipDiscount(tier_level)


# discount_id = db.Column(db.String, primary_key = True)
# 	discount_code = db.Column(db.String, unique = True)
# 	date_limit  = db.Column(db.DateTime)
# 	free_shipping = db.Column(db.Boolean)
# 	# this discount should come as an integers as a percent (we'll do whole numbers)
# 	item_discount = db.Column(db.Integer)

class MembershipDiscount:
	def __init__(self, tier_level):
		if tier_level == 0:
			self.free_shipping = False
			self.item_discount = 0
			self.discount_message = ""
		elif tier_level == 1:
			self.free_shipping = False
			self.item_discount = 10
			self.discount_message = "10% OFF DISCOUNT APPLIED"

	def toPublicDict(self):
		public_dict = {}
		public_dict['free_shipping'] = self.free_shipping
		public_dict['item_discount'] = self.item_discount
		public_dict['discount_message'] = self.discount_message
		return public_dict




		
