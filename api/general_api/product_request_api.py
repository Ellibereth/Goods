from flask import Blueprint, jsonify, request
import time
from passlib.hash import argon2
import base64

from ..utility.product_request_manager import ProductRequestManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	ProductId = "product_id"
	ConfirmationId = "confirmation_id"
	ImageData = "image_data"
	ProductDescription = "product_description"
	Email = "email"
	PriceRange = "price_range"
	Name = "name"
	PhoneNumber = "phone_number"


product_request_api = Blueprint('product_request_api', __name__)

request_keys = [Labels.ProductDescription,
				Labels.Email,
				Labels.PhoneNumber,
				Labels.PriceRange,
				Labels.Name
				]


## soft deletes a product request
@product_request_api.route('/softDeleteProductRequestBySubmissionId', methods = ['POST'])
def softDeleteProductRequestBySubmissionId():
	submission_id = request.json.get(Labels.SubmissionId)
	request_manager = ProductRequestManager(ProdTables.UserRequestTable)
	output = request_manager.softDeleteProductRequestBySubmissionId(submission_id)
	request_manager.closeConnection()
	return jsonify(output)

@product_request_api.route('/getProductRequests', methods =['POST'])
def getProductRequests():
	request_manager = ProductRequestManager(ProdTables.UserRequestTable)
	product_requests = request_manager.getProductRequests()
	request_manager.closeConnection()
	return jsonify(product_requests)

@product_request_api.route('/verifyProductSubmission', methods =['POST'])
def verifyProductSubmission():
	submission_id = request.json.get(Labels.SubmissionId)
	submission_manager = ProductSubmissionManager()
	submission_manager.verifyProductSubmission(submission_id)
	submission_manager.closeConnection()
	output = {}
	output[Labels.Success] = False
	return jsonify(output)

@product_request_api.route('/addProductRequest', methods = ['POST'])
def addProductRequest():
	product_requests = {}
	for key in request_keys:
		product_requests[key] = request.json.get(key)
	request_manager = ProductRequestManager(ProdTables.UserRequestTable)
	output = request_manager.addProductRequest(product_requests)
	request_manager.closeConnection()
	return jsonify(output)

## confirms a request 
@product_request_api.route('/confirmProductRequest', methods = ['POST'])
def confirmProductRequest():
	confirmation_id = request.json.get(Labels.ConfirmationId)
	request_manager = ProductRequestManager(ProdTables.UserRequestTable)
	output = request_manager.confirmProductRequest(confirmation_id)
	request_manager.closeConnection()
	return jsonify(output)
