"""" 
this class will represent a product 
depends on Labels class for it's labels
instance variables are private (figure out how to set this later)
"""
UserInfo = "user_info"
StripeCustomerId = "stripe_customer_id"
User = "user"

from api.utility.labels import UserLabels

class User:
	def __init__(self):
		self.Email
		self.TimeStamp
		self.EmailConfirmed
		self.EmailConfirmationId
		self.Password
		self.PasswordConfirm
		self.AccountId
		self.Success
		self.Error
		self.StripeCustomerId
		self.Name

	


