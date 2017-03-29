import stripe
from flask import jsonify
# Set your secret key: remember to change this to your live secret key in production
# See your keys here: https://dashboard.stripe.com/account/apikeys
stripe.api_key = "sk_test_B0VTmo1cTi1WfnlKEQjgVsjm"
prod_key = "sk_live_PW2L6feEEEciyHt2AR16V93u"

class StripeManager:
	def chargeCard(stripe_token, product):
		# multiply by 100 since stripe works in pennies
		# this casting is super lame, but can't cast "5.00" to an int apparently
		# so I have to cast to float then int...there must be a better way but it's 7 am 
		amount = int(float(product['price'])) * 100
		try:
			stripe.Charge.create(
			source = stripe_token['id'],
			amount = amount,
			currency="usd",
			description = product['description']
			)
		# do something better with this exception later
		except Exception as e:
			print(e)
