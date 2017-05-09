import stripe
import time
# Set your secret key: remember to change this to your live secret key in production
# See your keys here: https://dashboard.stripe.com/account/apikeys
test_key = "sk_test_B0VTmo1cTi1WfnlKEQjgVsjm"
prod_key = "sk_live_PW2L6feEEEciyHt2AR16V93u"

stripe.api_key = test_key


StripeCustomerId = "stripe_customer_id"
Price = "price"
Name = "name"
Id = "id"

class StripeManager:
	def chargeCustomer(user, price, token = None):
		# multiply by 100 since stripe works in pennies
		# this casting is super lame, but can't cast "5.00" to an int apparently
		# so I have to cast to float then int...there must be a better way but it's 7 am 
		amount = int(float(price) * 100) 
		try:
			# update the customer information if there is a token, otherwise 
			# just use previous information
			customer = stripe.Customer.retrieve(user.stripe_customer_id)
			if token != None:
				customer.source = token[Id]
				customer.save()

			# then charge the customer
			charge = stripe.Charge.create(
				customer = customer,
				amount = amount,
				currency= "usd"
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

	# adds a new credit card for a customer
	def addCardForCustomer(user, address_city, address_line1, address_line2, address_zip,
		exp_month, exp_year, number, cvc, name, address_state, address_country = "US"):
		customer = stripe.Customer.retrieve(user.stripe_customer_id)
		new_card = {}
		new_card['object'] = "card"
		new_card["address_city"] = address_city
		new_card["address_line1"] = address_line1
		new_card["address_line2"] = address_line2
		new_card['address_zip'] = address_zip
		new_card['exp_month'] = exp_month
		new_card['exp_year'] = exp_year
		new_card['number'] = number
		new_card['cvc'] = cvc
		new_card['name'] = name
		new_card["address_country"] = address_country
		new_card["adddress_stae"] = address_state
		new_card['metadata'] = {"date_created" : time.time()}
		customer.sources.create(card = new_card)

	def getUserCards(user):
		customer = stripe.Customer.retrieve(user.stripe_customer_id)
		return [this_card for this_card in customer.sources.data]

	def deleteCreditCard(user, card_id):
		customer = stripe.Customer.retrieve(user.stripe_customer_id)
		customer.sources.retrieve(card_id).delete()

	def chargeCustomerCard(user, card_id, price):
		amount = int(float(price) * 100)
		customer = stripe.Customer.retrieve(user.stripe_customer_id)
		charge = stripe.Charge.create(
				customer = customer,
				amount = amount,
				source = card_id,
				currency= "usd"
			)
		return charge

	def getCardFromChargeId(stripe_charge_id):
		card = stripe.Charge.retrieve(stripe_charge_id).source
		return card



