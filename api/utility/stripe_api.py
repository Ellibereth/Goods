import stripe
from flask import jsonify
# Set your secret key: remember to change this to your live secret key in production
# See your keys here: https://dashboard.stripe.com/account/apikeys
stripe.api_key = "sk_test_B0VTmo1cTi1WfnlKEQjgVsjm"
prod_key = "sk_live_PW2L6feEEEciyHt2AR16V93u"

StripeCustomerId = "stripe_customer_id"
Price = "price"
Name = "name"
Id = "id"

class StripeManager:
	def chargeCustomer(stripe_token, user, product):
		# multiply by 100 since stripe works in pennies
		# this casting is super lame, but can't cast "5.00" to an int apparently
		# so I have to cast to float then int...there must be a better way but it's 7 am 
		amount = int(float(product.price) * 100) 
		try:
			# update the customer information 
			customer = stripe.Customer.retrieve(user.stripe_customer_id)
			customer.source = stripe_token[Id]
			customer.save()

			# then charge the customer
			charge = stripe.Charge.create(
				customer = customer,
				amount = amount,
				currency= "usd",
				description = product.description
			)
			return charge

		# do something better with this exception later
		except Exception as e:
			print(e)

	def doesCustomerExist(user):
		# stripe api throws an error if the customer doesn't exist so we use a try except here
		try:
			customer = stripe.Customer.retrieve(user.stripe_customer_id)
			return customer
		except:
			return None


	# creates a customer object just from the user's name. No payment information yet
	# returns the customer stripe id
	def createCustomer(name, email):
		customer = stripe.Customer.create(
				description = name,
				email = email
			)
		return customer[Id]
