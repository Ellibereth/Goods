from flask import Blueprint, jsonify, request
import time
import base64

from ..utility.stripe_api import StripeManager
from ..utility.order_manager import OrderManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	Product = "product"
	StripeToken = "stripeToken"
	User = "user"
	Orders = "orders"

payment_api = Blueprint('payment_api', __name__)

@payment_api.route('/acceptStripePayment', methods = ['POST'])
def acceptStripePayment():
	# Token is created using Stripe.js or Checkout!
	# Get the payment token submitted by the form:
	token = request.json.get(Labels.StripeToken) # Using Flask
	product = request.json.get(Labels.Product)
	user = request.json.get(Labels.User)
	charge = StripeManager.chargeCustomer(token, user, product)
	order_manager = OrderManager(ProdTables.OrderTable)
	order_manager.addOrder(user, product, charge)
	order_manager.closeConnection()
	return jsonify({Labels.Success : True})

@payment_api.route('/getUserOrders', methods = ['POST'])
def getUserOrders():
	user = request.json.get(Labels.User)
	order_manager = OrderManager(ProdTables.OrderTable)
	this_user_orders = order_manager.getUserOrders(user)
	order_manager.closeConnection()
	return jsonify({Labels.Success : True, Labels.Orders : this_user_orders})