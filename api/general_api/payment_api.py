from flask import Blueprint, jsonify, request
import time
import base64

from ..utility.stripe_api import StripeManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	Product = "product"
	StripeToken = "stripeToken"

payment_api = Blueprint('payment_api', __name__)

@payment_api.route('/acceptStripePayment', methods = ['POST'])
def acceptStripePayment():
	# Token is created using Stripe.js or Checkout!
	# Get the payment token submitted by the form:
	token = request.json.get(Labels.StripeToken) # Using Flask
	product = request.json.get(Labels.Product)
	StripeManager.chargeCard(token, product)
	return jsonify({Labels.Success : True})