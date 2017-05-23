from flask import Blueprint, jsonify, request
import time
from passlib.hash import argon2
import base64

from ..utility.table_names import ProdTables

from api.utility import email_api
from api.models.shared_models import db
from api.models.request import Request
from api.utility.labels import RequestLabels as Labels
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil

product_request_api = Blueprint('product_request_api', __name__)



## soft deletes a product request
@product_request_api.route('/softDeleteProductRequestByRequestId', methods = ['POST'])
def softDeleteProductRequestByRequestId():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()

	request_id = request.json.get(Labels.RequestId)
	if request_id == None:
		return JsonUtil.failure("Bad input")
	this_request = Request.query.filter_by(request_id = request_id).first()
	if this_request == None:
		return JsonUtil.failure("This request id doesn't exist")
	this_request.soft_deleted = True
	db.session.commit()
	return JsonUtil.success()

@product_request_api.route('/getProductRequests', methods =['POST'])
def getProductRequests():
	jwt = request.json.get(Labels.Jwt)
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	all_requests = Request.query.all()
	return jsonify([req.toPublicDict() for req in all_requests])


@product_request_api.route('/addProductRequest', methods = ['POST'])
def addProductRequest():
	email = request.json.get(Labels.Email)
	name = request.json.get(Labels.Name)
	description = request.json.get(Labels.Description)
	price_range = request.json.get(Labels.PriceRange)
	phone_number = request.json.get(Labels.PhoneNumber)
	# this is optional for now, but might add later
	# account_id = request.json.get(Labels.AccountId)

	# send the confirmation email to all
	new_request = Request(email, name, description, price_range, phone_number)
	try: 
		email_api.sendRequestConfirmation(new_request)
		# otherwise there's an error in the email
	except:
		return JsonUtil.failure("This email is not valid")
	# now send us the email too
	email_api.sendRequestEmail(new_request)

	# once this is all good, we can commit to database
	db.session.add(new_request)
	db.session.commit()
	return JsonUtil.success(Labels.Request, new_request.toPublicDict())

## confirms a request 
@product_request_api.route('/confirmProductRequest', methods = ['POST'])
def confirmProductRequest():
	confirmation_id = request.json.get(Labels.ConfirmationId)
	if confirmation_id == None:
		return JsonUtil.failure("No confirmation id sent or bad input")
	this_request = Request.query.filter_by(confirmation_id = confirmation_id).first()
	if this_request == None:
		return JsonUtil.failure("Bad confirmation id")

	this_request.confirmed = True
	db.session.commit()
	return JsonUtil.success()
