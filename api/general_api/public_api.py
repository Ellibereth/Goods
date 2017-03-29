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


class Labels:
	Success = "success"
	ProductId = "product_id"
	Asin = 'asin'
	IsUsa = 'isUsa'
	SubmissionId = "submission_id"
	ConfirmationId = "confirmation_id"
	FeedbackId = "feedback_id"
	Password = "password"
	PasswordConfirm = "password_confirm"
	EmailConfirmationId = "email_confirmation_id"
	StripeToken = "stripeToken"
	ImageId = "image_id"
	ManufacturerName = "manufacturer_name"
	UrlLink = "url_link"
	ContactInformation = "contact_information"
	ProductName = "product_name"
	Origin = "origin"
	BarcodeUpc = "barcode_upc"
	BarcodeType = "barcode_type"
	AdditionalInfo = "additional_info"
	Verified = "verified"
	Images = "images"
	TimeStamp = "time_stamp"
	ProductDescription = "product_description"
	PriceRange = "price_range"
	Name = "name"
	Feedback = "feedback"
	Description = "description"
	Brand = "brand"
	Category = "category"
	Price = "price"
	Manufacturer = "manufacturer"
	Email = "email"
	PhoneNumber = "phone_number"
	ImageData = "image_data"
	Amount = "amount"
	Product = "product"

public_api = Blueprint('public_api', __name__)

## this is the same as the submission variables in product_data_manager.py 
## should I just put these in a CSV?
submission_keys = [
					Labels.SubmissionId, 
					Labels.ImageId,
					Labels.TimeStamp,
					Labels.ManufacturerName,
					Labels.UrlLink,
					Labels.ContactInformation,
					Labels.ProductName,
					Labels.Origin,
					Labels.BarcodeUpc,
					Labels.BarcodeType,
					Labels.AdditionalInfo,
					Labels.Verified,
					Labels.Images
				 ]

request_keys = [Labels.ProductDescription,
				Labels.Email,
				Labels.PhoneNumber,
				Labels.PriceRange,
				Labels.Name
				]

register_keys = [Labels.Name, Labels.Email, Labels.Password, Labels.PasswordConfirm]
feedback_keys = [Labels.Name , Labels.Email, Labels.Feedback]
admin_login_password = 'powerplay'		
market_product_keys = [Labels.Price, Labels.Manufacturer, Labels.Name, Labels.Category, Labels.Description , Labels.Brand]

@public_api.route('/addProductSubmission', methods = ['POST'])
def addProductSubmission():
	submission = {}
	for key in submission_keys:
		submission[key] = request.json.get(key)
	submission_manager = ProductSubmissionManager()
	submission_manager.addProductSubmission(submission)
	submission_manager.closeConnection()
	output = {Labels.Success : False}
	return jsonify(output)

@public_api.route('/getProductSubmissions', methods =['POST'])
def getProductSubmissions():
	submission_manager = ProductSubmissionManager()
	product_submissions = submission_manager.getProductSubmissions()
	submission_manager.closeConnection()
	return jsonify(product_submissions)


@public_api.route('/getProductRequests', methods =['POST'])
def getProductRequests():
	request_manager = ProductRequestManager(ProdTables.UserRequestTable)
	product_requests = request_manager.getProductRequests()
	request_manager.closeConnection()
	return jsonify(product_requests)

@public_api.route('/verifyProductSubmission', methods =['POST'])
def verifyProductSubmission():
	submission_id = request.json.get(Labels.SubmissionId)
	submission_manager = ProductSubmissionManager()
	submission_manager.verifyProductSubmission(submission_id)
	submission_manager.closeConnection()
	output = {}
	output[Labels.Success] = False
	return jsonify(output)

@public_api.route('/addProductRequest', methods = ['POST'])
def addProductRequest():
	product_requests = {}
	for key in request_keys:
		product_requests[key] = request.json.get(key)
	request_manager = ProductRequestManager(ProdTables.UserRequestTable)
	output = request_manager.addProductRequest(product_requests)
	request_manager.closeConnection()
	return jsonify(output)

@public_api.route('/addMarketProduct', methods = ['POST'])
def addMarketProduct():
	market_product = {}
	for key in market_product_keys:
		market_product[key] = request.json.get(key)
	market = MarketProductManager(ProdTables.MarketProductTable)
	output = market.addMarketProduct(market_product)
	market.closeConnection()
	return jsonify(output)

@public_api.route('/addFeedback', methods = ['POST'])
def addFeedback():
	feedback = {}
	for key in feedback_keys:
		feedback[key] = request.json.get(key)
	feedback_manager = FeedbackManager(ProdTables.FeedbackTable)
	output = feedback_manager.addFeedback(feedback)
	feedback_manager.closeConnection()
	return jsonify(output)

@public_api.route('/checkAdminLogin', methods =['POST'])
def checkAdminLogin():
	password = request.json.get(Labels.Password)
	output = {}
	if password == admin_login_password:
		output[Labels.Success] = True
	else:
		output[Labels.Success] = False
	return jsonify(output)

## confirms a request 
@public_api.route('/confirmProductRequest', methods = ['POST'])
def confirmProductRequest():
	confirmation_id = request.json.get(Labels.ConfirmationId)
	request_manager = ProductRequestManager(ProdTables.UserRequestTable)
	output = request_manager.confirmProductRequest(confirmation_id)
	request_manager.closeConnection()
	return jsonify(output)

@public_api.route('/confirmEmail', methods = ['POST'])
def confirmEmail():
	email_confirmation_id = request.json.get(Labels.EmailConfirmationId)
	account_manager = AccountManager(ProdTables.UserInfoTable)
	output = account_manager.confirmEmail(email_confirmation_id)
	account_manager.closeConnection()
	return jsonify(output)

## soft deletes a product request
@public_api.route('/softDeleteProductRequestBySubmissionId', methods = ['POST'])
def softDeleteProductRequestBySubmissionId():
	submission_id = request.json.get(Labels.SubmissionId)
	request_manager = ProductRequestManager(ProdTables.UserRequestTable)
	output = request_manager.softDeleteProductRequestBySubmissionId(submission_id)
	request_manager.closeConnection()
	return jsonify(output)

@public_api.route('/isAsinMadeInUsa', methods = ['POST'])
def isAsinMadeInUsa():
	asin = request.json.get(Labels.Asin)
	amazon = AmazonManager(ProdTables.AmazonScrapingTable)
	isUsa = amazon.isAsinMadeInUsa(asin)
	amazon.closeConnection()
	output = {}
	output[Labels.IsUsa] = isUsa
	return jsonify(output)

@public_api.route('/getAmazonProductInformationFromAsin', methods = ['POST'])
def getAmazonProductInformationFromAsin():
	asin = request.json.get(Labels.Asin)
	amazon = AmazonManager(ProdTables.AmazonScrapingTable)
	product = amazon.getProductInfoByAsin(asin)
	amazon.closeConnection()
	return jsonify(product)

@public_api.route('/registerUserAccount', methods = ['POST'])
def registerUserAccount():
	user_info = {}
	output = {}
	for key in register_keys:
		user_info[key] = request.json.get(key)
	account_manager = AccountManager(ProdTables.UserInfoTable)
	output = account_manager.addUser(user_info)
	account_manager.closeConnection()
	return jsonify(product)

@public_api.route('/checkLogin', methods = ['POST'])
def checkLogin():
	user_info = {}
	output = {}
	for key in register_keys:
		user_info[key] = request.json.get(key)
	account_manager = AccountManager(ProdTables.UserInfoTable)
	output = account_manager.checkLogin(user_info)
	account_manager.closeConnection()
	return jsonify(product)

@public_api.route('/acceptStripePayment', methods = ['POST'])
def acceptStripePayment():
	# Token is created using Stripe.js or Checkout!
	# Get the payment token submitted by the form:
	token = request.json.get(Labels.StripeToken) # Using Flask
	product = request.json.get(Labels.Product)
	StripeManager.chargeCard(token, product)
	return jsonify({Labels.Success : True})


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
	product_id = request.json.get(Labels.ProductId)
	market = MarketProductManager(ProdTables.MarketProductTable)
	market_product = market.getMarketProductById(product_id)
	market.closeConnection()
	return jsonify(market_product)

@public_api.route('/uploadMarketProductImage', methods = ['POST'])
def uploadMarketProductImage():
	## yes Ben I know this is a magic string / hard coded
	## tell me how to make this better!
	product_id = request.json.get(Labels.ProductId)
	image_data = request.json.get(Labels.ImageData)
	image_bytes = image_data.encode('utf-8')
	image_decoded = base64.decodestring(image_bytes)
	market = MarketProductManager(ProdTables.MarketProductTable)
	market.uploadMarketProductImage(product_id, image_decoded)
	market.closeConnection()
	return jsonify({Labels.Success : True})
