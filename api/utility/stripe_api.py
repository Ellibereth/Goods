import stripe
# Set your secret key: remember to change this to your live secret key in production
# See your keys here: https://dashboard.stripe.com/account/apikeys
stripe.api_key = "sk_test_B0VTmo1cTi1WfnlKEQjgVsjm"
prod_key = "sk_live_PW2L6feEEEciyHt2AR16V93u"

class StripeManager:
	def chargeCard(stripe_token, amount):
		# Charge the user's card:
		for key in stripe_token.keys():
			print(key + " : " + str(stripe_token.get(key)))
		try:
			stripe.Charge.create(
			source = dict(stripe_token),
			amount = amount,
			currency="usd"
			# description="Example charge"
			)
		except stripe.error.CardError as e:
		  # Since it's a decline, stripe.error.CardError will be caught
		  body = e.json_body
		  err  = body['error']
		except stripe.error.RateLimitError as e:
		  # Too many requests made to the API too quickly
		  pass
		except stripe.error.InvalidRequestError as e:
		  # Invalid parameters were supplied to Stripe's API
		  print(e)
		  pass
		except stripe.error.AuthenticationError as e:
		  # Authentication with Stripe's API failed
		  # (maybe you changed API keys recently)
		  pass
		except stripe.error.APIConnectionError as e:
		  # Network communication with Stripe failed
		  pass
		except stripe.error.StripeError as e:
		  # Display a very generic error to the user, and maybe send
		  # yourself an email
		  pass
		except Exception as e:
		  # Something else happened, completely unrelated to Stripe
		  pass
		# except:
		# 	return {"Success" : False, "Error" : "Card Declined, Try Again"}


