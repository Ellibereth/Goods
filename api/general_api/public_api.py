from flask import Blueprint, jsonify, request
import time
from passlib.hash import argon2
import base64
from ..utility.product_submission_manager import ProductSubmissionManager
from ..utility.product_request_manager import ProductRequestManager
from ..utility.account_manager import AccountManager
from ..utility.feedback_manager import FeedbackManager
from ..utility.amazon_manager import AmazonManager
from ..utility.stripe_api import StripeManager
from ..utility.market_product import MarketProductManager
from ..utility.table_names import ProdTables
from ..utility.table_names import TestTables

class Labels:
	Success = "success"

public_api = Blueprint('public_api', __name__)


## this is the same as the submission variables in product_data_manager.py 
## should I just put these in a CSV?
submission_keys = [
					'submission_id', 
					'image_id',
					'time_stamp',
					'manufacturer_name',
					'url_link',
					'contact_information',
					'product_name',
					'origin',
					'barcode_upc',
					'barcode_type',
					'additional_info',
					'verified',
					'images'
				 ]

request_keys = ['product_description',
				'email',
				'phone_number',
				'price_range',
				'name'
				]


register_keys = ['name', 'email', 'password', 'password_confirm']
feedback_keys = ['name' , 'email', 'feedback']

admin_login_password = 'powerplay'

						
market_product_keys = ['price', 'manufacturer', 'name', 'category', 'description' ,'brand']

@public_api.route('/addProductSubmission', methods = ['POST'])
def addProductSubmission():
	submission = {}
	for key in submission_keys:
		submission[key] = request.json.get(key)
	submission_manager = ProductSubmissionManager()
	submission_manager.addProductSubmission(submission)
	submission_manager.closeConnection()
	output = {"success" : False}
	return jsonify(output)

@public_api.route('/getProductSubmissions', methods =['POST'])
def getProductSubmissions():
	submission_manager = ProductSubmissionManager()
	product_submissions = submission_manager.getProductSubmissions()
	submission_manager.closeConnection()
	return jsonify(product_submissions)

## HERE STILL
@public_api.route('/getProductRequests', methods =['POST'])
def getProductRequests():
	request_manager = ProductRequestManager()
	product_requests = request_manager.getProductRequests()
	request_manager.closeConnection()
	return jsonify(product_requests)

@public_api.route('/verifyProductSubmission', methods =['POST'])
def verifyProductSubmission():
	submission_id = request.json.get("submission_id")
	submission_manager = ProductSubmissionManager()
	submission_manager.verifyProductSubmission(submission_id)
	submission_manager.closeConnection()
	output = {}
	output['success'] = False
	return jsonify(output)

@public_api.route('/addProductRequest', methods = ['POST'])
def addProductRequest():
	product_requests = {}
	output = {}
	for key in request_keys:
		product_requests[key] = request.json.get(key)
	request_manager = ProductRequestManager()
	output = request_manager.addProductRequest(product_requests)
	request_manager.closeConnection()
	return jsonify(output)

@public_api.route('/addMarketProduct', methods = ['POST'])
def addMarketProduct():
	market_product = {}
	output = {}
	for key in market_product_keys:
		market_product[key] = request.json.get(key)
	market = MarketProductManager(ProdTables.MarketProductTable)
	output = market.addMarketProduct(market_product)
	market.closeConnection()
	return jsonify(output)

@public_api.route('/addFeedback', methods = ['POST'])
def addFeedback():
	feedback = {}
	output = {}
	for key in feedback_keys:
		feedback[key] = request.json.get(key)
	feedback_manager = FeedbackManager()
	output = feedback_manager.addFeedback(feedback)
	feedback_manager.closeConnection()
	return jsonify(output)

@public_api.route('/checkAdminLogin', methods =['POST'])
def checkAdminLogin():
	password = request.json.get('password')
	output = {}
	if password == admin_login_password:
		output['success'] = True
	else:
		output['success'] = False
	return jsonify(output)

## confirms a request 
@public_api.route('/confirmProductRequest', methods = ['POST'])
def confirmProductRequest():
	confirmation_id = request.json.get('confirmation_id')
	request_manager = ProductRequestManager()
	output = request_manager.confirmProductRequest(confirmation_id)
	request_manager.closeConnection()
	return jsonify(output)

@public_api.route('/confirmEmail', methods = ['POST'])
def confirmEmail():
	email_confirmation_id = request.json.get('email_confirmation_id')
	account_manager = AccountManager()
	output = account_manager.confirmEmail(email_confirmation_id)
	account_manager.closeConnection()
	return jsonify(output)

## soft deletes a product request
@public_api.route('/softDeleteProductRequestBySubmissionId', methods = ['POST'])
def softDeleteProductRequestBySubmissionId():
	submission_id = request.json.get('submission_id')
	request_manager = ProductRequestManager()
	output = request_manager.softDeleteProductRequestBySubmissionId(submission_id)
	request_manager.closeConnection()
	return jsonify(output)

@public_api.route('/isAsinMadeInUsa', methods = ['POST'])
def isAsinMadeInUsa():
	asin = request.json.get('asin')
	amazon = AmazonManager()
	isUsa = amazon.isAsinMadeInUsa(asin)
	amazon.closeConnection()
	output = {}
	output['isUsa'] = isUsa
	return jsonify(output)

@public_api.route('/getAmazonProductInformationFromAsin', methods = ['POST'])
def getAmazonProductInformationFromAsin():
	asin = request.json.get('asin')
	amazon = AmazonManager()
	product = amazon.getProductInfoByAsin(asin)
	amazon.closeConnection()
	print(product)
	return jsonify(product)

@public_api.route('/registerUserAccount', methods = ['POST'])
def registerUserAccount():
	user_info = {}
	output = {}
	for key in register_keys:
		user_info[key] = request.json.get(key)
	account_manager = AccountManager()
	output = account_manager.addUser(user_info)
	account_manager.closeConnection()
	return jsonify(product)

@public_api.route('/checkLogin', methods = ['POST'])
def checkLogin():
	user_info = {}
	output = {}
	for key in register_keys:
		user_info[key] = request.json.get(key)
	account_manager = AccountManager()
	output = account_manager.checkLogin(user_info)
	account_manager.closeConnection()
	return jsonify(product)

@public_api.route('/acceptStripePayment', methods = ['POST'])
def acceptStripePayment():
	# Token is created using Stripe.js or Checkout!
	# Get the payment token submitted by the form:
	token = request.POST['stripeToken'] # Using Flask
	StripeManager.chargeCard(token)
	return {Labels.Success : True}


@public_api.route('/getMarketProducts', methods = ['POST'])
def getMarketProducts():
	market = MarketProductManager(ProdTables.MarketProductTable)
	market_products = market.getMarketProducts()
	market.closeConnection()
	return jsonify(market_products)


@public_api.route('/getMarketProductInfo', methods = ['POST'])
def getMarketProductInfo():
	## yes Ben I know this is a magic string / hard coded
	## tell me how to make this better!
	product_id = request.json.get("product_id")
	market = MarketProductManager(ProdTables.MarketProductTable)
	market_product = market.getMarketProductById(product_id)
	market.closeConnection()
	return jsonify(market_product)
