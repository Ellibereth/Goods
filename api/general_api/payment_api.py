from flask import Blueprint, jsonify, request
import time
import base64

from ..utility.stripe_api import StripeManager
from ..utility.transaction_manager import TransactionManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	Product = "product"
	StripeToken = "stripeToken"
	User = "user"

payment_api = Blueprint('payment_api', __name__)

@payment_api.route('/acceptStripePayment', methods = ['POST'])
def acceptStripePayment():
	# Token is created using Stripe.js or Checkout!
	# Get the payment token submitted by the form:
	token = request.json.get(Labels.StripeToken) # Using Flask
	product = request.json.get(Labels.Product)
	user = request.json.get(Labels.User)
	charge = StripeManager.chargeCustomer(token, user, product)
	transaction_manager = TransactionManager(ProdTables.TransactionTable)
	transaction_manager.addTransaction(user, product, charge)
	transaction_manager.closeConnection()

	return jsonify({Labels.Success : True})