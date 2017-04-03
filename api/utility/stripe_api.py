import stripe
from flask import jsonify
# Set your secret key: remember to change this to your live secret key in production
# See your keys here: https://dashboard.stripe.com/account/apikeys
stripe.api_key = "sk_test_B0VTmo1cTi1WfnlKEQjgVsjm"
prod_key = "sk_live_PW2L6feEEEciyHt2AR16V93u"

class StripeManager:
	def chargeCustomer(stripe_token, user, product):
		# multiply by 100 since stripe works in pennies
		# this casting is super lame, but can't cast "5.00" to an int apparently
		# so I have to cast to float then int...there must be a better way but it's 7 am 
		amount = int(float(product['price'])) * 100
		try:
			# update the customer information 
			customer = stripe.Customer.retrieve(user['stripe_id'])
			customer.source = stripe_token['id']
			customer.save()
			customer = stripe.Customer.retrieve(user['stripe_id'])

			# then charge the customer
			stripe.Charge.create(
				customer = customer,
				amount = int(float(product['price'])) * 100,
				currency= "usd",
				description = product['price']
			)

		# do something better with this exception later
		except Exception as e:
			print(e)

	def doesCustomerExist(user):
		# stripe api throws an error if the customer doesn't exist so we use a try except here
		try:
			customer = stripe.Customer.retrieve(user['stripe_id'])
			return customer
		except:
			return None


	# creates a customer object just from the users name. No payment information yet
	# returns the customer stripe id
	def createCustomerFromUser(user):
		customer = stripe.Customer.create(
				description= user['name']
			)
		return customer['id']
