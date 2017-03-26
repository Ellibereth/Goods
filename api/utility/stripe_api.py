import stripe
# Set your secret key: remember to change this to your live secret key in production
# See your keys here: https://dashboard.stripe.com/account/apikeys
stripe.api_key = "sk_test_B0VTmo1cTi1WfnlKEQjgVsjm"

class StripeManager:
	def chargeCard(stripe_token):
		# Charge the user's card:
		charge = stripe.Charge.create(
		  amount=1000,
		  currency="usd",
		  description="Example charge",
		  source=token,
		)


