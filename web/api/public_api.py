from flask import Blueprint, jsonify, request
import time
from passlib.hash import argon2
import base64
from product_data_manager import ProductDataManager
from account_manager import AccountManager
from feedback_manager import FeedbackManager

# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

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

feedback_keys = ['name' , 'email', 'feedback']

admin_login_password = 'powerplay'

@public_api.route('/addProductSubmission', methods = ['POST'])
def addProductSubmission():
	submission = {}
	for key in submission_keys:
		submission[key] = request.json.get(key)
	data_manager = ProductDataManager()
	data_manager.addProductSubmission(submission)
	data_manager.closeConnection()
	output = {"success" : False}
	return jsonify(output)

@public_api.route('/getProductSubmissions', methods =['POST'])
def getProductSubmissions():
	data_manager = ProductDataManager()
	product_submissions = data_manager.getProductSubmissions()
	data_manager.closeConnection()
	return jsonify(product_submissions)

@public_api.route('/getProductRequests', methods =['POST'])
def getProductRequests():
	data_manager = ProductDataManager()
	product_requests = data_manager.getProductRequests()
	data_manager.closeConnection()
	return jsonify(product_requests)

@public_api.route('/verifyProductSubmission', methods =['POST'])
def verifySubmission():
	submission_id = request.json.get("submission_id")
	data_manager = ProductDataManager()
	data_manager.verifyProductSubmission(submission_id)
	data_manager.closeConnection()
	output = {}
	output['success'] = False
	return jsonify(output)

@public_api.route('/addProductRequest', methods = ['POST'])
def addProductRequest():
	product_requests = {}
	output = {}
	for key in request_keys:
		product_requests[key] = request.json.get(key)
	data_manager = ProductDataManager()
	output = data_manager.addProductRequest(product_requests)
	data_manager.closeConnection()
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
	product_manager = ProductDataManager()
	output = product_manager.confirmProductRequest(confirmation_id)
	product_manager.closeConnection()
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
	product_manager = ProductDataManager()
	output = product_manager.confirmProductRequest(submission_id)
	product_manager.closeConnection()
	return jsonify(output)


# @public_api.route('/isAsinMadeInUsa', methods = ['POST'])
